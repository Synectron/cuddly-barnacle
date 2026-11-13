"""
Windows Driver Scanner, Initiator & Updater
Scans PnP devices/drivers, can enable/start them, and install
driver updates from Windows Update.
Run as Administrator for initiate/update actions.
"""

from __future__ import annotations

import argparse
import ctypes
import json
import os
import subprocess
import sys
from dataclasses import asdict, dataclass
from typing import Optional


@dataclass
class DeviceInfo:
    instance_id: str
    name: str
    status: str
    class_name: str
    problem: str
    driver_provider: str
    driver_version: str
    driver_date: str


def is_admin() -> bool:
    try:
        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def run_powershell(script: str, timeout: int = 120) -> str:
    completed = subprocess.run(
        [
            "powershell.exe",
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            script,
        ],
        capture_output=True,
        text=True,
        timeout=timeout,
        encoding="utf-8",
        errors="replace",
    )
    if completed.returncode != 0 and not completed.stdout.strip():
        err = (completed.stderr or completed.stdout or "PowerShell failed").strip()
        raise RuntimeError(err)
    return completed.stdout.strip()


SCAN_SCRIPT = r"""
$ErrorActionPreference = 'Stop'
$devices = Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue
$result = foreach ($d in $devices) {
    $driver = $null
    try {
        $driver = Get-PnpDeviceProperty -InstanceId $d.InstanceId -KeyName `
            'DEVPKEY_Device_DriverProvider',
            'DEVPKEY_Device_DriverVersion',
            'DEVPKEY_Device_DriverDate' -ErrorAction SilentlyContinue
    } catch {}

    $provider = ($driver | Where-Object { $_.KeyName -like '*DriverProvider*' }).Data
    $version  = ($driver | Where-Object { $_.KeyName -like '*DriverVersion*' }).Data
    $date     = ($driver | Where-Object { $_.KeyName -like '*DriverDate*' }).Data

    [PSCustomObject]@{
        InstanceId     = $d.InstanceId
        Name           = $d.FriendlyName
        Status         = $d.Status.ToString()
        Class          = $d.Class
        Problem        = if ($d.Problem) { $d.Problem.ToString() } else { '' }
        DriverProvider = if ($provider) { [string]$provider } else { '' }
        DriverVersion  = if ($version)  { [string]$version }  else { '' }
        DriverDate     = if ($date)     { ([datetime]$date).ToString('yyyy-MM-dd') } else { '' }
    }
}
$result | ConvertTo-Json -Depth 4 -Compress
"""


def scan_devices() -> list[DeviceInfo]:
    raw = run_powershell(SCAN_SCRIPT, timeout=180)
    if not raw:
        return []
    data = json.loads(raw)
    if isinstance(data, dict):
        data = [data]
    devices: list[DeviceInfo] = []
    for item in data:
        devices.append(
            DeviceInfo(
                instance_id=item.get("InstanceId") or "",
                name=item.get("Name") or "(unnamed)",
                status=item.get("Status") or "",
                class_name=item.get("Class") or "",
                problem=item.get("Problem") or "",
                driver_provider=item.get("DriverProvider") or "",
                driver_version=item.get("DriverVersion") or "",
                driver_date=item.get("DriverDate") or "",
            )
        )
    return devices


def initiate_device(instance_id: str) -> str:
    # Escape single quotes for PowerShell single-quoted string
    safe_id = instance_id.replace("'", "''")
    script = f"""
$ErrorActionPreference = 'Stop'
$id = '{safe_id}'
$dev = Get-PnpDevice -InstanceId $id -ErrorAction Stop
Enable-PnpDevice -InstanceId $id -Confirm:$false -ErrorAction Stop
try {{
    # Some stacks expose Start-PnpDevice (Win10+)
    Start-PnpDevice -InstanceId $id -Confirm:$false -ErrorAction SilentlyContinue
}} catch {{}}
$after = Get-PnpDevice -InstanceId $id
"Initiated: $($after.FriendlyName) | Status=$($after.Status)"
"""
    return run_powershell(script)


UPDATE_LIST_SCRIPT = r"""
$ErrorActionPreference = 'Stop'
# Criteria: Driver updates that are not already installed
$criteria = 'IsInstalled=0 and Type=''Driver'''
$session = New-Object -ComObject Microsoft.Update.Session
$searcher = $session.CreateUpdateSearcher()
$searcher.ServerSelection = 2  # ssWindowsUpdate
$result = $searcher.Search($criteria)
$updates = @()
for ($i = 0; $i -lt $result.Updates.Count; $i++) {
    $u = $result.Updates.Item($i)
    $updates += [PSCustomObject]@{
        Title    = $u.Title
        SizeMB   = [math]::Round($u.MaxDownloadSize / 1MB, 1)
        IsDownloaded = [bool]$u.IsDownloaded
        Identity = $u.Identity.UpdateID
    }
}
@{
    Count   = $updates.Count
    Updates = $updates
} | ConvertTo-Json -Depth 5 -Compress
"""

UPDATE_INSTALL_SCRIPT = r"""
$ErrorActionPreference = 'Stop'
$criteria = 'IsInstalled=0 and Type=''Driver'''
$session = New-Object -ComObject Microsoft.Update.Session
$searcher = $session.CreateUpdateSearcher()
$searcher.ServerSelection = 2
Write-Output 'Searching Windows Update for driver updates...'
$result = $searcher.Search($criteria)
if ($result.Updates.Count -eq 0) {
    Write-Output 'No driver updates available from Windows Update.'
    exit 0
}
$toInstall = New-Object -ComObject Microsoft.Update.UpdateColl
for ($i = 0; $i -lt $result.Updates.Count; $i++) {
    $u = $result.Updates.Item($i)
    Write-Output ("Queued: " + $u.Title)
    [void]$toInstall.Add($u)
}
Write-Output ("Downloading " + $toInstall.Count + " driver update(s)...")
$downloader = $session.CreateUpdateDownloader()
$downloader.Updates = $toInstall
$dl = $downloader.Download()
Write-Output ("Download result code: " + $dl.ResultCode)

$ready = New-Object -ComObject Microsoft.Update.UpdateColl
for ($i = 0; $i -lt $toInstall.Count; $i++) {
    $u = $toInstall.Item($i)
    if ($u.EulaAccepted -eq $false) { $u.AcceptEula() }
    if ($u.IsDownloaded) { [void]$ready.Add($u) }
}
if ($ready.Count -eq 0) {
    Write-Output 'Nothing downloaded successfully; install skipped.'
    exit 1
}
Write-Output ("Installing " + $ready.Count + " driver update(s)...")
$installer = $session.CreateUpdateInstaller()
$installer.Updates = $ready
$inst = $installer.Install()
Write-Output ("Install result code: " + $inst.ResultCode)
Write-Output ("Reboot required: " + $inst.RebootRequired)
for ($i = 0; $i -lt $ready.Count; $i++) {
    $u = $ready.Item($i)
    $ur = $inst.GetUpdateResult($i)
    Write-Output ("[" + $ur.ResultCode + "] " + $u.Title)
}
if ($inst.RebootRequired) {
    Write-Output 'A reboot is required to finish driver installation.'
}
"""


def list_driver_updates() -> dict:
    raw = run_powershell(UPDATE_LIST_SCRIPT, timeout=300)
    if not raw:
        return {"Count": 0, "Updates": []}
    data = json.loads(raw)
    if data.get("Updates") is None:
        data["Updates"] = []
    if isinstance(data["Updates"], dict):
        data["Updates"] = [data["Updates"]]
    return data


def update_windows_update_drivers() -> str:
    return run_powershell(UPDATE_INSTALL_SCRIPT, timeout=3600)


DETECT_HW_SCRIPT = r"""
$ErrorActionPreference = 'SilentlyContinue'
$cs = Get-CimInstance Win32_ComputerSystem
$bb = Get-CimInstance Win32_BaseBoard
$gpus = @(Get-CimInstance Win32_VideoController | ForEach-Object {
    [PSCustomObject]@{
        Name = $_.Name
        PnpId = $_.PNPDeviceID
        DriverVersion = $_.DriverVersion
    }
})
$oem = (($cs.Manufacturer, $bb.Manufacturer) -join ' ').ToLower()
$gpuText = (($gpus | ForEach-Object { $_.Name + ' ' + $_.PnpId }) -join ' ').ToLower()
[PSCustomObject]@{
    Manufacturer = [string]$cs.Manufacturer
    Model        = [string]$cs.Model
    OemKey       = if ($oem -match 'lenovo|ibm') { 'lenovo' }
                   elseif ($oem -match 'dell') { 'dell' }
                   elseif ($oem -match 'hp|hewlett') { 'hp' }
                   elseif ($oem -match 'asus') { 'asus' }
                   elseif ($oem -match 'acer') { 'acer' }
                   elseif ($oem -match 'msi') { 'msi' }
                   elseif ($oem -match 'microsoft') { 'microsoft' }
                   else { 'generic' }
    HasNvidia    = [bool]($gpuText -match 'nvidia|ven_10de')
    HasAmdGpu    = [bool]($gpuText -match 'amd|radeon|ven_1002')
    HasIntelGpu  = [bool]($gpuText -match 'intel|iris|uhd|ven_8086')
    Gpus         = $gpus
} | ConvertTo-Json -Depth 5 -Compress
"""

OEM_WINGET = {
    "lenovo": "Lenovo.SystemUpdate",
    "dell": "Dell.CommandUpdate.Universal",
    "hp": "HP.SupportAssistant",
}

VENDOR_WINGET = {
    "intel_dsa": "Intel.IntelDriverAndSupportAssistant",
    "nvidia_tnuc": "Hawaii_Beach.TinyNvidiaUpdateChecker",
    "dotnet10": "Microsoft.DotNet.DesktopRuntime.10",
}


def detect_hardware() -> dict:
    raw = run_powershell(DETECT_HW_SCRIPT, timeout=60)
    data = json.loads(raw) if raw else {}
    gpus = data.get("Gpus") or []
    if isinstance(gpus, dict):
        gpus = [gpus]
    data["Gpus"] = gpus
    return data


def winget_available() -> bool:
    try:
        completed = subprocess.run(
            ["winget", "--version"],
            capture_output=True,
            text=True,
            timeout=30,
        )
        return completed.returncode == 0
    except Exception:
        return False


def winget_install(package_id: str) -> tuple[bool, str]:
    if not winget_available():
        return False, "winget not available"
    cmd = [
        "winget",
        "install",
        "--id",
        package_id,
        "-e",
        "--accept-package-agreements",
        "--accept-source-agreements",
        "--disable-interactivity",
        "--silent",
    ]
    completed = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=1800,
        encoding="utf-8",
        errors="replace",
    )
    out = ((completed.stdout or "") + "\n" + (completed.stderr or "")).strip()
    # 0 success, -1978335189 already installed (common winget code)
    ok = completed.returncode in {0, -1978335189} or "already installed" in out.lower()
    return ok, out or f"exit={completed.returncode}"


def _first_existing(paths: list[str]) -> Optional[str]:
    for p in paths:
        if p and os.path.isfile(p):
            return p
    return None


def _run_cmd(args: list[str], timeout: int = 3600) -> tuple[bool, str]:
    completed = subprocess.run(
        args,
        capture_output=True,
        text=True,
        timeout=timeout,
        encoding="utf-8",
        errors="replace",
    )
    out = ((completed.stdout or "") + "\n" + (completed.stderr or "")).strip()
    return completed.returncode == 0, out or f"exit={completed.returncode}"


def update_lenovo() -> str:
    lines: list[str] = []
    ok, msg = winget_install(OEM_WINGET["lenovo"])
    lines.append(f"winget Lenovo.SystemUpdate: {'OK' if ok else 'FAIL'} ({msg.splitlines()[-1] if msg else ''})")
    exe = _first_existing(
        [
            r"C:\Program Files (x86)\Lenovo\System Update\tvsu.exe",
            r"C:\Program Files\Lenovo\System Update\tvsu.exe",
        ]
    )
    if not exe:
        lines.append("Lenovo System Update executable not found after install.")
        return "\n".join(lines)

    # Documented AdminCommandLine policy so /CM can install silently
    ps = r"""
$ErrorActionPreference = 'Stop'
$pol = 'HKLM:\SOFTWARE\Policies\Lenovo\System Update\UserSettings\General'
New-Item -Path $pol -Force | Out-Null
Set-ItemProperty -Path $pol -Name AdminCommandLine -Value '-search A -action INSTALL -packagetypes 2,3,4 -includerebootpackages 1,3,4,5 -noicon -noreboot -nolicense'
$sch = 'HKLM:\SOFTWARE\WOW6432Node\Lenovo\System Update\Preferences\UserSettings\Scheduler'
if (Test-Path $sch) { Set-ItemProperty -Path $sch -Name SchedulerAbility -Value 'NO' -ErrorAction SilentlyContinue }
'policy-ok'
"""
    try:
        run_powershell(ps, timeout=30)
        lines.append("Configured Lenovo AdminCommandLine policy.")
    except Exception as exc:
        lines.append(f"Lenovo policy setup warning: {exc}")

    ok_run, out = _run_cmd([exe, "/CM"], timeout=3600)
    lines.append(f"Lenovo System Update: {'OK' if ok_run else 'DONE/CHECK'} {out[:500]}")
    return "\n".join(lines)


def update_dell() -> str:
    lines: list[str] = []
    ok, msg = winget_install(OEM_WINGET["dell"])
    lines.append(f"winget Dell Command Update: {'OK' if ok else 'FAIL'} ({msg.splitlines()[-1] if msg else ''})")
    exe = _first_existing(
        [
            r"C:\Program Files\Dell\CommandUpdate\dcu-cli.exe",
            r"C:\Program Files (x86)\Dell\CommandUpdate\dcu-cli.exe",
        ]
    )
    if not exe:
        lines.append("Dell dcu-cli.exe not found after install.")
        return "\n".join(lines)
    ok_run, out = _run_cmd(
        [
            exe,
            "/applyUpdates",
            "-updateType=driver,firmware,bios,application",
            "-silent",
            "-reboot=disable",
        ],
        timeout=3600,
    )
    lines.append(f"Dell Command Update: {'OK' if ok_run else 'DONE/CHECK'} {out[:500]}")
    return "\n".join(lines)


def update_hp() -> str:
    lines: list[str] = []
    ok, msg = winget_install(OEM_WINGET["hp"])
    lines.append(f"winget HP Support Assistant: {'OK' if ok else 'FAIL'} ({msg.splitlines()[-1] if msg else ''})")
    # HPSA is primarily GUI; launch it so the user/session can apply updates.
    launched = False
    for path in [
        r"C:\Program Files (x86)\HP\HP Support Framework\HPSF.exe",
        r"C:\Program Files (x86)\Hewlett-Packard\HP Support Framework\HPSF.exe",
        r"C:\Program Files\HP\HP Support Framework\HPSF.exe",
    ]:
        if os.path.isfile(path):
            subprocess.Popen([path], close_fds=True)
            lines.append(f"Launched HP Support Assistant: {path}")
            launched = True
            break
    if not launched:
        lines.append("HP Support Assistant installed/available — open it from Start to apply OEM updates.")
    return "\n".join(lines)


def update_intel_dsa() -> str:
    lines: list[str] = []
    ok, msg = winget_install(VENDOR_WINGET["intel_dsa"])
    lines.append(f"winget Intel DSA: {'OK' if ok else 'FAIL'} ({msg.splitlines()[-1] if msg else ''})")
    exe = _first_existing(
        [
            r"C:\Program Files (x86)\Intel\Driver and Support Assistant\DSATray.exe",
            r"C:\Program Files\Intel\Driver and Support Assistant\DSATray.exe",
            r"C:\Program Files (x86)\Intel\Driver and Support Assistant\IntelDriverAndSupportAssistant.exe",
        ]
    )
    if exe:
        subprocess.Popen([exe], close_fds=True)
        lines.append(f"Launched Intel Driver & Support Assistant: {exe}")
        lines.append("Intel DSA will scan and offer the latest Intel chipset/graphics/audio drivers.")
    else:
        lines.append("Intel DSA executable not found — reopen after install from Start Menu.")
    return "\n".join(lines)


def update_nvidia() -> str:
    lines: list[str] = []
    ok_dotnet, msg_dotnet = winget_install(VENDOR_WINGET["dotnet10"])
    lines.append(f"winget .NET Desktop Runtime 10: {'OK' if ok_dotnet else 'FAIL'}")
    ok, msg = winget_install(VENDOR_WINGET["nvidia_tnuc"])
    lines.append(f"winget TinyNvidiaUpdateChecker: {'OK' if ok else 'FAIL'} ({msg.splitlines()[-1] if msg else ''})")

    # Portable winget apps often land under LocalAppData\Microsoft\WinGet\Packages
    candidates: list[str] = []
    local = os.environ.get("LOCALAPPDATA", "")
    pkg_root = os.path.join(local, "Microsoft", "WinGet", "Packages")
    if os.path.isdir(pkg_root):
        for root, _dirs, files in os.walk(pkg_root):
            for f in files:
                if f.lower() == "tinynvidiaupdatechecker.exe":
                    candidates.append(os.path.join(root, f))
    candidates.extend(
        [
            os.path.join(local, "Microsoft", "WinGet", "Links", "TinyNvidiaUpdateChecker.exe"),
            r"C:\Program Files\TinyNvidiaUpdateChecker\TinyNvidiaUpdateChecker.exe",
        ]
    )
    exe = _first_existing(candidates)
    if not exe:
        # winget link shim
        where = subprocess.run(
            ["where.exe", "TinyNvidiaUpdateChecker.exe"],
            capture_output=True,
            text=True,
            timeout=30,
        )
        if where.returncode == 0 and where.stdout.strip():
            exe = where.stdout.strip().splitlines()[0].strip()

    if not exe:
        lines.append("TinyNvidiaUpdateChecker.exe not found after install.")
        return "\n".join(lines)

    ok_run, out = _run_cmd([exe, "--quiet", "--confirm-dl", "--noprompt"], timeout=3600)
    lines.append(f"NVIDIA driver update: {'OK' if ok_run else 'DONE/CHECK'} {out[:500]}")
    return "\n".join(lines)


def update_amd() -> str:
    lines: list[str] = []
    # No stable silent Adrenalin package on winget; open official support page
    # and also try Windows Update drivers already covered separately.
    url = "https://www.amd.com/en/support/download/drivers.html"
    try:
        os.startfile(url)  # type: ignore[attr-defined]
        lines.append(f"Opened AMD driver download page: {url}")
        lines.append("Use AMD Auto-Detect / Adrenalin installer for the latest GPU driver.")
    except Exception as exc:
        lines.append(f"Could not open AMD page ({exc}). Visit {url}")
    return "\n".join(lines)


def update_vendor_drivers(hw: Optional[dict] = None) -> str:
    hw = hw or detect_hardware()
    sections: list[str] = []
    sections.append(
        f"Detected: {hw.get('Manufacturer')} {hw.get('Model')} | OEM={hw.get('OemKey')} | "
        f"NVIDIA={hw.get('HasNvidia')} AMD={hw.get('HasAmdGpu')} IntelGPU={hw.get('HasIntelGpu')}"
    )

    oem = (hw.get("OemKey") or "generic").lower()
    if oem == "lenovo":
        sections.append("--- Lenovo OEM ---")
        sections.append(update_lenovo())
    elif oem == "dell":
        sections.append("--- Dell OEM ---")
        sections.append(update_dell())
    elif oem == "hp":
        sections.append("--- HP OEM ---")
        sections.append(update_hp())
    else:
        sections.append(f"--- OEM ({oem}) ---")
        sections.append("No automated OEM updater mapped; Windows Update + GPU vendor paths still apply.")

    # Intel DSA covers Intel CPU/chipset/graphics broadly — run when Intel GPU present or always useful on Intel CPUs
    if hw.get("HasIntelGpu") or oem in {"lenovo", "dell", "hp", "asus", "acer", "msi", "microsoft", "generic"}:
        # Still run DSA if Intel GPU; also helpful for chipset on many PCs
        if hw.get("HasIntelGpu"):
            sections.append("--- Intel Driver & Support Assistant ---")
            sections.append(update_intel_dsa())

    if hw.get("HasNvidia"):
        sections.append("--- NVIDIA ---")
        sections.append(update_nvidia())

    if hw.get("HasAmdGpu"):
        sections.append("--- AMD ---")
        sections.append(update_amd())

    return "\n".join(sections)


def update_all_drivers(include_vendors: bool = True) -> str:
    parts: list[str] = []
    parts.append("=== Windows Update drivers ===")
    try:
        parts.append(update_windows_update_drivers())
    except Exception as exc:
        parts.append(f"Windows Update drivers failed: {exc}")

    if include_vendors:
        parts.append("\n=== OEM / GPU vendor drivers ===")
        try:
            parts.append(update_vendor_drivers())
        except Exception as exc:
            parts.append(f"Vendor updates failed: {exc}")

    parts.append("\nDone. Reboot if prompted, then re-run --list-updates / OEM tools if anything remains.")
    return "\n".join(parts)


def initiate_problem_devices(devices: list[DeviceInfo]) -> list[tuple[str, str, bool]]:
    targets = [
        d
        for d in devices
        if d.status.lower() in {"error", "degraded", "unknown"}
        or (d.problem and d.problem not in {"", "CM_PROB_NONE", "0"})
    ]
    # Also try disabled devices
    targets += [d for d in devices if d.status.lower() == "disabled"]
    # Deduplicate by instance id
    seen: set[str] = set()
    unique: list[DeviceInfo] = []
    for d in targets:
        if d.instance_id and d.instance_id not in seen:
            seen.add(d.instance_id)
            unique.append(d)

    results: list[tuple[str, str, bool]] = []
    for d in unique:
        try:
            msg = initiate_device(d.instance_id)
            results.append((d.name, msg, True))
        except Exception as exc:
            results.append((d.name, str(exc), False))
    return results


def print_table(devices: list[DeviceInfo], problems_only: bool = False) -> None:
    rows = devices
    if problems_only:
        rows = [
            d
            for d in devices
            if d.status.lower() not in {"ok", "started"}
            or (d.problem and d.problem not in {"", "CM_PROB_NONE", "0"})
        ]

    print(f"\nFound {len(rows)} device(s)" + (" with issues" if problems_only else "") + "\n")
    print(f"{'Status':<12} {'Class':<18} {'Name':<40} {'Problem':<16} Version")
    print("-" * 110)
    for d in sorted(rows, key=lambda x: (x.status, x.class_name, x.name)):
        name = (d.name[:37] + "...") if len(d.name) > 40 else d.name
        cls = (d.class_name[:16] + "..") if len(d.class_name) > 18 else d.class_name
        prob = (d.problem[:14] + "..") if len(d.problem) > 16 else d.problem
        print(f"{d.status:<12} {cls:<18} {name:<40} {prob:<16} {d.driver_version}")


def interactive_menu() -> None:
    print("=" * 60)
    print("  Windows Driver Scanner, Initiator & Updater")
    print("=" * 60)
    print(f"  Elevated privileges: {'YES' if is_admin() else 'NO (needed to initiate/update)'}")
    print()
    print("  1) Scan all present devices/drivers")
    print("  2) Scan problem / disabled devices only")
    print("  3) Initiate problem & disabled devices")
    print("  4) Initiate a specific device (InstanceId)")
    print("  5) List available driver updates (Windows Update)")
    print("  6) Update Windows Update drivers only")
    print("  7) Update OEM/GPU vendors (Lenovo/Dell/HP/Intel/NVIDIA/AMD)")
    print("  8) Update ALL (Windows Update + OEM/GPU vendors)")
    print("  9) Export full scan to JSON")
    print("  0) Exit")
    print()

    devices_cache: Optional[list[DeviceInfo]] = None

    while True:
        choice = input("Select option: ").strip()
        if choice == "0":
            break
        try:
            if choice in {"1", "2", "3", "9"} and devices_cache is None:
                print("Scanning devices (this may take a moment)...")
                devices_cache = scan_devices()

            if choice == "1":
                print_table(devices_cache or [])
            elif choice == "2":
                print_table(devices_cache or [], problems_only=True)
            elif choice == "3":
                if not is_admin():
                    print("ERROR: Re-run this tool as Administrator to initiate drivers.")
                    continue
                print("Initiating problem/disabled devices...")
                results = initiate_problem_devices(devices_cache or [])
                if not results:
                    print("No problem/disabled devices to initiate.")
                for name, msg, ok in results:
                    flag = "OK" if ok else "FAIL"
                    print(f"  [{flag}] {name}: {msg}")
                devices_cache = None  # force rescan next time
            elif choice == "4":
                if not is_admin():
                    print("ERROR: Re-run this tool as Administrator to initiate drivers.")
                    continue
                iid = input("Enter PnP InstanceId: ").strip()
                if not iid:
                    print("InstanceId required.")
                    continue
                print(initiate_device(iid))
                devices_cache = None
            elif choice == "5":
                print("Checking Windows Update for driver updates...")
                data = list_driver_updates()
                count = int(data.get("Count") or 0)
                print(f"\nFound {count} driver update(s)\n")
                for u in data.get("Updates") or []:
                    print(f"  - {u.get('Title')} ({u.get('SizeMB')} MB)")
            elif choice == "6":
                if not is_admin():
                    print("ERROR: Re-run this tool as Administrator to update drivers.")
                    continue
                confirm = input("Install Windows Update drivers? [y/N]: ").strip().lower()
                if confirm not in {"y", "yes"}:
                    print("Cancelled.")
                    continue
                print(update_all_drivers(include_vendors=False))
                devices_cache = None
            elif choice == "7":
                if not is_admin():
                    print("ERROR: Re-run this tool as Administrator to update OEM/GPU drivers.")
                    continue
                confirm = input("Install/run OEM + GPU vendor updaters? [y/N]: ").strip().lower()
                if confirm not in {"y", "yes"}:
                    print("Cancelled.")
                    continue
                print(update_vendor_drivers())
                devices_cache = None
            elif choice == "8":
                if not is_admin():
                    print("ERROR: Re-run this tool as Administrator to update drivers.")
                    continue
                confirm = input("Update via Windows Update + OEM/GPU vendors? [y/N]: ").strip().lower()
                if confirm not in {"y", "yes"}:
                    print("Cancelled.")
                    continue
                print(update_all_drivers(include_vendors=True))
                devices_cache = None
            elif choice == "9":
                path = input("Output path [drivers_scan.json]: ").strip() or "drivers_scan.json"
                payload = [asdict(d) for d in (devices_cache or [])]
                with open(path, "w", encoding="utf-8") as fh:
                    json.dump(payload, fh, indent=2)
                print(f"Wrote {len(payload)} devices to {path}")
            else:
                print("Unknown option.")
        except Exception as exc:
            print(f"ERROR: {exc}")


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Scan Windows PnP devices/drivers, initiate them, and update via Windows Update."
    )
    parser.add_argument("--scan", action="store_true", help="Scan all present devices")
    parser.add_argument("--problems", action="store_true", help="Show problem/disabled only")
    parser.add_argument(
        "--initiate",
        action="store_true",
        help="Enable/start problem and disabled devices (requires Admin)",
    )
    parser.add_argument("--device", metavar="INSTANCE_ID", help="Initiate one device by InstanceId")
    parser.add_argument(
        "--list-updates",
        action="store_true",
        help="List available driver updates from Windows Update",
    )
    parser.add_argument(
        "--update",
        action="store_true",
        help="Update via Windows Update + OEM/GPU vendors (requires Admin)",
    )
    parser.add_argument(
        "--update-wu",
        action="store_true",
        help="Windows Update drivers only (requires Admin)",
    )
    parser.add_argument(
        "--update-vendors",
        action="store_true",
        help="OEM/GPU vendor updaters only: Lenovo/Dell/HP/Intel/NVIDIA/AMD (requires Admin)",
    )
    parser.add_argument("--detect", action="store_true", help="Show detected OEM/GPU hardware")
    parser.add_argument("--export", metavar="PATH", help="Export scan JSON to PATH")
    parser.add_argument("--json", action="store_true", help="Print scan as JSON")
    args = parser.parse_args(argv)

    # No flags -> interactive
    if not any(
        [
            args.scan,
            args.problems,
            args.initiate,
            args.device,
            args.list_updates,
            args.update,
            args.update_wu,
            args.update_vendors,
            args.detect,
            args.export,
            args.json,
        ]
    ):
        interactive_menu()
        return 0

    if args.detect:
        print(json.dumps(detect_hardware(), indent=2))
        return 0

    if args.list_updates:
        print("Checking Windows Update for driver updates...", file=sys.stderr)
        data = list_driver_updates()
        count = int(data.get("Count") or 0)
        print(f"Found {count} driver update(s)")
        for u in data.get("Updates") or []:
            print(f"  - {u.get('Title')} ({u.get('SizeMB')} MB)")
        return 0

    if args.update or args.update_wu or args.update_vendors:
        if not is_admin():
            print("ERROR: Administrator rights required to update drivers.", file=sys.stderr)
            return 1
        if args.update:
            print(update_all_drivers(include_vendors=True))
        elif args.update_wu:
            print(update_all_drivers(include_vendors=False))
        else:
            print(update_vendor_drivers())
        return 0

    devices: list[DeviceInfo] = []
    if args.scan or args.problems or args.initiate or args.export or args.json:
        print("Scanning devices...", file=sys.stderr)
        devices = scan_devices()

    if args.json:
        print(json.dumps([asdict(d) for d in devices], indent=2))
    elif args.problems:
        print_table(devices, problems_only=True)
    elif args.scan:
        print_table(devices)

    if args.export:
        with open(args.export, "w", encoding="utf-8") as fh:
            json.dump([asdict(d) for d in devices], fh, indent=2)
        print(f"Exported {len(devices)} devices to {args.export}", file=sys.stderr)

    if args.device:
        if not is_admin():
            print("ERROR: Administrator rights required to initiate drivers.", file=sys.stderr)
            return 1
        print(initiate_device(args.device))

    if args.initiate:
        if not is_admin():
            print("ERROR: Administrator rights required to initiate drivers.", file=sys.stderr)
            return 1
        results = initiate_problem_devices(devices)
        if not results:
            print("No problem/disabled devices found.")
        for name, msg, ok in results:
            print(f"[{'OK' if ok else 'FAIL'}] {name}: {msg}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
