# DriverScan

Windows utility to **scan** PnP devices, **initiate** problem/disabled drivers, and **update** via Windows Update plus OEM/GPU vendors (Lenovo, Dell, HP, Intel, NVIDIA, AMD).

**Site:** [driverscan.opuskiln.com](https://driverscan.opuskiln.com) · **Fallback:** [driverscan.vercel.app](https://driverscan.vercel.app)  
**Releases:** [GitHub Releases](https://github.com/Synectron/cuddly-barnacle/releases)

## Download

1. Get `DriverScanInit.exe` from the [website](https://driverscan.vercel.app/downloads/DriverScanInit.exe) or [latest release](https://github.com/Synectron/cuddly-barnacle/releases/latest).
2. Right-click → **Run as administrator** (required for initiate/update).

## Features

- Scan present PnP devices (status, class, driver version)
- List problem / disabled devices
- Enable and start stuck devices
- Install driver updates from Windows Update
- Run OEM/GPU updaters when detected:
  - **Lenovo** System Update
  - **Dell** Command Update
  - **HP** Support Assistant
  - **Intel** Driver & Support Assistant
  - **NVIDIA** via TinyNvidiaUpdateChecker
  - **AMD** opens the official driver download page

## Usage

Desktop UI (default — no terminal window):

```bat
DriverScanInit.exe
```

Right-click → **Run as administrator** for initiate/update actions (or use the in-app **Run as Administrator** button).

Terminal menu (optional):

```bat
DriverScanInit.exe --cli
```

CLI:

```bat
DriverScanInit.exe --detect
DriverScanInit.exe --scan
DriverScanInit.exe --problems
DriverScanInit.exe --initiate
DriverScanInit.exe --list-updates
DriverScanInit.exe --update-wu
DriverScanInit.exe --update-vendors
DriverScanInit.exe --update
DriverScanInit.exe --export drivers_scan.json
```

| Flag               | Purpose                                 |
| ------------------ | --------------------------------------- |
| `--detect`         | Show OEM / GPU detection                |
| `--scan`           | List all present devices                |
| `--problems`       | Problem / disabled only                 |
| `--initiate`       | Enable/start problem & disabled devices |
| `--list-updates`   | List Windows Update drivers             |
| `--update-wu`      | Install Windows Update drivers only     |
| `--update-vendors` | OEM / GPU vendor updaters only          |
| `--update`         | Windows Update **and** vendor updaters  |
| `--export PATH`    | Write scan JSON                         |
| `--json`           | Print scan as JSON                      |

Reboot if prompted after BIOS/chipset/GPU packages.

## Source

Main script: [`driver_scan.py`](driver_scan.py)

Build the EXE (requires Python + PyInstaller):

```bat
pip install pyinstaller
pyinstaller --noconfirm DriverScanInit.spec
```

The spec builds a **windowed** EXE (`console=False`) with the desktop UI. Pass CLI flags for scripting; use `--cli` for the old terminal menu.

Output: `dist\DriverScanInit.exe`

## Website

Next.js app in [`website/`](website/):

```bat
cd website
npm install
npm run dev
```

Production is deployed on Vercel. Canonical host is `driverscan.opuskiln.com` (add DNS `A driverscan → 76.76.21.21` if the subdomain is not live yet).

## License

See repository for license details. Vendor tools (Lenovo, Dell, HP, Intel, NVIDIA, AMD, Microsoft) remain under their own terms.
