"""
Windows Driver Scanner & Initiator
Scans PnP devices/drivers and can enable/start them.
Run as Administrator for initiate actions.
"""

from __future__ import annotations

import argparse
import ctypes
import json
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
    print("  Windows Driver Scanner & Initiator")
    print("=" * 60)
    print(f"  Elevated privileges: {'YES' if is_admin() else 'NO (needed to initiate)'}")
    print()
    print("  1) Scan all present devices/drivers")
    print("  2) Scan problem / disabled devices only")
    print("  3) Initiate problem & disabled devices")
    print("  4) Initiate a specific device (InstanceId)")
    print("  5) Export full scan to JSON")
    print("  0) Exit")
    print()

    devices_cache: Optional[list[DeviceInfo]] = None

    while True:
        choice = input("Select option: ").strip()
        if choice == "0":
            break
        try:
            if choice in {"1", "2", "3", "5"} and devices_cache is None:
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
        description="Scan Windows PnP devices/drivers and initiate (enable/start) them."
    )
    parser.add_argument("--scan", action="store_true", help="Scan all present devices")
    parser.add_argument("--problems", action="store_true", help="Show problem/disabled only")
    parser.add_argument(
        "--initiate",
        action="store_true",
        help="Enable/start problem and disabled devices (requires Admin)",
    )
    parser.add_argument("--device", metavar="INSTANCE_ID", help="Initiate one device by InstanceId")
    parser.add_argument("--export", metavar="PATH", help="Export scan JSON to PATH")
    parser.add_argument("--json", action="store_true", help="Print scan as JSON")
    args = parser.parse_args(argv)

    # No flags -> interactive
    if not any([args.scan, args.problems, args.initiate, args.device, args.export, args.json]):
        interactive_menu()
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
