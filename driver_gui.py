"""
DriverScan desktop UI — replaces the terminal menu for normal launches.
"""

from __future__ import annotations

import json
import os
import sys
import threading
import tkinter as tk
from dataclasses import asdict
from tkinter import filedialog, messagebox, ttk
from typing import Callable, Optional

import driver_scan as core

APP_TITLE = "DriverScan"
APP_VERSION = "1.2.0"

# Opuskiln-aligned palette
C_BG = "#f3f5f8"
C_PANEL = "#ffffff"
C_INK = "#0e151b"
C_MUTED = "#5d6b78"
C_PRIMARY = "#0f6cbd"
C_DARK = "#101820"
C_OK = "#2f9b6a"
C_WARN = "#c28a14"
C_ERR = "#c62828"
C_BORDER = "#d5dde6"
C_CONSOLE = "#101820"
C_CONSOLE_FG = "#c5d0da"


def _restart_as_admin() -> None:
    if sys.platform != "win32":
        return
    try:
        params = " ".join(f'"{a}"' for a in sys.argv[1:])
        core.ctypes.windll.shell32.ShellExecuteW(
            None, "runas", sys.executable, params, None, 1
        )
        sys.exit(0)
    except Exception as exc:
        messagebox.showerror(APP_TITLE, f"Could not elevate:\n{exc}")


class DriverScanApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title(f"{APP_TITLE} — Opuskiln")
        self.geometry("1080x720")
        self.minsize(900, 600)
        self.configure(bg=C_BG)

        self.devices: list[core.DeviceInfo] = []
        self._busy = False
        self._hw: Optional[dict] = None

        self._build_style()
        self._build_layout()
        self.after(200, self._refresh_header)

    def _build_style(self) -> None:
        style = ttk.Style(self)
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass

        style.configure(".", background=C_BG, foreground=C_INK, font=("Segoe UI", 10))
        style.configure("TFrame", background=C_BG)
        style.configure("Card.TFrame", background=C_PANEL)
        style.configure("TLabel", background=C_BG, foreground=C_INK)
        style.configure("Card.TLabel", background=C_PANEL, foreground=C_INK)
        style.configure("Muted.TLabel", background=C_BG, foreground=C_MUTED)
        style.configure("CardMuted.TLabel", background=C_PANEL, foreground=C_MUTED)
        style.configure("Title.TLabel", background=C_BG, foreground=C_INK, font=("Segoe UI Semibold", 18))
        style.configure("Brand.TLabel", background=C_BG, foreground=C_PRIMARY, font=("Consolas", 9))
        style.configure("TButton", padding=(12, 8), font=("Segoe UI Semibold", 10))
        style.configure(
            "Primary.TButton",
            background=C_DARK,
            foreground="#f4f7fa",
            padding=(14, 10),
            font=("Segoe UI Semibold", 10),
        )
        style.map(
            "Primary.TButton",
            background=[("active", "#1a2733"), ("disabled", "#9aa5b1")],
            foreground=[("disabled", "#e8eef5")],
        )
        style.configure(
            "Accent.TButton",
            background=C_PRIMARY,
            foreground="#ffffff",
            padding=(14, 10),
            font=("Segoe UI Semibold", 10),
        )
        style.map("Accent.TButton", background=[("active", "#0a4f8c"), ("disabled", "#9aa5b1")])
        style.configure(
            "Treeview",
            background=C_PANEL,
            fieldbackground=C_PANEL,
            foreground=C_INK,
            rowheight=28,
            borderwidth=0,
            font=("Segoe UI", 9),
        )
        style.configure(
            "Treeview.Heading",
            background=C_BG,
            foreground=C_MUTED,
            font=("Segoe UI Semibold", 9),
            relief="flat",
        )
        style.map("Treeview", background=[("selected", "#d6e8f8")], foreground=[("selected", C_INK)])
        style.configure("Horizontal.TProgressbar", troughcolor=C_BORDER, background=C_PRIMARY, thickness=4)
        style.configure("TSeparator", background=C_BORDER)

    def _build_layout(self) -> None:
        root = ttk.Frame(self, padding=16)
        root.pack(fill="both", expand=True)

        header = ttk.Frame(root)
        header.pack(fill="x", pady=(0, 12))

        left = ttk.Frame(header)
        left.pack(side="left", fill="x", expand=True)
        ttk.Label(left, text="OPUSKILN UTILITY", style="Brand.TLabel").pack(anchor="w")
        ttk.Label(left, text=APP_TITLE, style="Title.TLabel").pack(anchor="w")
        self.status_lbl = ttk.Label(left, text="Ready", style="Muted.TLabel")
        self.status_lbl.pack(anchor="w", pady=(4, 0))

        right = ttk.Frame(header)
        right.pack(side="right")
        self.admin_lbl = ttk.Label(right, text="", style="Muted.TLabel")
        self.admin_lbl.pack(side="left", padx=(0, 10))
        self.elevate_btn = ttk.Button(right, text="Run as Administrator", command=_restart_as_admin)
        self.elevate_btn.pack(side="left")

        body = ttk.Frame(root)
        body.pack(fill="both", expand=True)

        actions = ttk.Frame(body, style="Card.TFrame", padding=14)
        actions.pack(side="left", fill="y", padx=(0, 12))
        actions.configure(width=220)

        ttk.Label(actions, text="Actions", style="Card.TLabel", font=("Segoe UI Semibold", 11)).pack(
            anchor="w", pady=(0, 8)
        )

        self._action_buttons: list[ttk.Button] = []
        specs = [
            ("Scan devices", self.do_scan, "Primary.TButton"),
            ("Show problems", self.do_problems, "TButton"),
            ("Initiate stuck drivers", self.do_initiate, "Accent.TButton"),
            ("Detect OEM / GPU", self.do_detect, "TButton"),
            ("List Windows Update", self.do_list_updates, "TButton"),
            ("Update (Windows Update)", self.do_update_wu, "TButton"),
            ("Update (OEM / GPU)", self.do_update_vendors, "TButton"),
            ("Update all", self.do_update_all, "Accent.TButton"),
            ("Export JSON…", self.do_export, "TButton"),
        ]
        for label, cmd, style_name in specs:
            btn = ttk.Button(actions, text=label, command=cmd, style=style_name)
            btn.pack(fill="x", pady=4)
            self._action_buttons.append(btn)

        ttk.Separator(actions, orient="horizontal").pack(fill="x", pady=12)
        ttk.Label(
            actions,
            text=f"v{APP_VERSION}\nDriverScanInit.exe",
            style="CardMuted.TLabel",
            justify="left",
        ).pack(anchor="w")

        main = ttk.Frame(body)
        main.pack(side="left", fill="both", expand=True)

        table_card = ttk.Frame(main, style="Card.TFrame", padding=10)
        table_card.pack(fill="both", expand=True)

        cols = ("status", "class", "name", "problem", "version")
        self.tree = ttk.Treeview(
            table_card,
            columns=cols,
            show="headings",
            selectmode="browse",
        )
        headings = {
            "status": ("Status", 90),
            "class": ("Class", 120),
            "name": ("Device", 320),
            "problem": ("Problem", 120),
            "version": ("Driver", 120),
        }
        for key, (title, width) in headings.items():
            self.tree.heading(key, text=title, anchor="w")
            self.tree.column(key, width=width, minwidth=60, anchor="w")

        yscroll = ttk.Scrollbar(table_card, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=yscroll.set)
        self.tree.pack(side="left", fill="both", expand=True)
        yscroll.pack(side="right", fill="y")

        self.tree.tag_configure("ok", foreground=C_OK)
        self.tree.tag_configure("bad", foreground=C_ERR)
        self.tree.tag_configure("warn", foreground=C_WARN)

        log_wrap = ttk.Frame(main)
        log_wrap.pack(fill="both", expand=False, pady=(12, 0))

        log_header = ttk.Frame(log_wrap)
        log_header.pack(fill="x")
        ttk.Label(log_header, text="Activity", style="Muted.TLabel").pack(side="left")
        self.progress = ttk.Progressbar(log_header, mode="indeterminate", length=160)
        self.progress.pack(side="right")

        self.log = tk.Text(
            log_wrap,
            height=10,
            wrap="word",
            bg=C_CONSOLE,
            fg=C_CONSOLE_FG,
            insertbackground=C_CONSOLE_FG,
            relief="flat",
            padx=12,
            pady=10,
            font=("Consolas", 9),
        )
        self.log.pack(fill="both", expand=True, pady=(6, 0))
        self.log.configure(state="disabled")

    def _refresh_header(self) -> None:
        admin = core.is_admin()
        if admin:
            self.admin_lbl.configure(text="Administrator · ready")
            self.elevate_btn.configure(state="disabled")
        else:
            self.admin_lbl.configure(text="Standard user · elevate for initiate/update")
            self.elevate_btn.configure(state="normal")

    def _set_status(self, text: str) -> None:
        self.status_lbl.configure(text=text)

    def _log(self, text: str) -> None:
        self.log.configure(state="normal")
        self.log.insert("end", text.rstrip() + "\n")
        self.log.see("end")
        self.log.configure(state="disabled")

    def _set_busy(self, busy: bool, status: str = "") -> None:
        self._busy = busy
        state = "disabled" if busy else "normal"
        for btn in self._action_buttons:
            btn.configure(state=state)
        if not core.is_admin():
            self.elevate_btn.configure(state="normal")
        else:
            self.elevate_btn.configure(state="disabled")
        if busy:
            self.progress.start(12)
            if status:
                self._set_status(status)
        else:
            self.progress.stop()
            if status:
                self._set_status(status)

    def _require_admin(self) -> bool:
        if core.is_admin():
            return True
        if messagebox.askyesno(
            APP_TITLE,
            "This action needs Administrator rights.\n\nRestart DriverScan elevated now?",
        ):
            _restart_as_admin()
        return False

    def _confirm(self, message: str) -> bool:
        return bool(messagebox.askyesno(APP_TITLE, message))

    def _run_async(self, title: str, work: Callable[[], None]) -> None:
        if self._busy:
            return

        def runner() -> None:
            try:
                work()
            except Exception as exc:
                self.after(0, lambda: self._log(f"ERROR: {exc}"))
                self.after(0, lambda: messagebox.showerror(APP_TITLE, str(exc)))
            finally:
                self.after(0, lambda: self._set_busy(False, "Ready"))

        self._set_busy(True, title)
        self._log(f"\n› {title}")
        threading.Thread(target=runner, daemon=True).start()

    def _fill_tree(self, devices: list[core.DeviceInfo], problems_only: bool = False) -> None:
        self.tree.delete(*self.tree.get_children())
        rows = devices
        if problems_only:
            rows = [
                d
                for d in devices
                if d.status.lower() not in {"ok", "started"}
                or (d.problem and d.problem not in {"", "CM_PROB_NONE", "0"})
            ]
        for d in sorted(rows, key=lambda x: (x.status, x.class_name, x.name)):
            tag = "ok"
            st = d.status.lower()
            if st in {"error", "degraded", "unknown"} or (
                d.problem and d.problem not in {"", "CM_PROB_NONE", "0"}
            ):
                tag = "bad"
            elif st == "disabled":
                tag = "warn"
            self.tree.insert(
                "",
                "end",
                values=(d.status, d.class_name, d.name, d.problem or "—", d.driver_version or "—"),
                tags=(tag,),
            )
        kind = "problem device(s)" if problems_only else "device(s)"
        self._set_status(f"Showing {len(rows)} {kind}")

    def _ensure_scan(self) -> list[core.DeviceInfo]:
        if not self.devices:
            self.after(0, lambda: self._log("Scanning PnP devices…"))
            self.devices = core.scan_devices()
            self.after(0, lambda: self._log(f"Scan complete · {len(self.devices)} devices"))
        return self.devices

    def do_scan(self) -> None:
        def work() -> None:
            self.devices = core.scan_devices()
            devices = list(self.devices)
            self.after(0, lambda: self._fill_tree(devices))
            self.after(0, lambda: self._log(f"Listed {len(devices)} present devices."))

        self._run_async("Scanning devices…", work)

    def do_problems(self) -> None:
        def work() -> None:
            devices = self._ensure_scan()
            self.after(0, lambda: self._fill_tree(devices, problems_only=True))
            bad = [
                d
                for d in devices
                if d.status.lower() not in {"ok", "started"}
                or (d.problem and d.problem not in {"", "CM_PROB_NONE", "0"})
            ]
            self.after(0, lambda: self._log(f"Filtered to {len(bad)} problem/disabled device(s)."))

        self._run_async("Loading problems…", work)

    def do_initiate(self) -> None:
        if not self._require_admin():
            return
        if not self._confirm("Enable and start problem/disabled devices?"):
            return

        def work() -> None:
            devices = self._ensure_scan()
            results = core.initiate_problem_devices(devices)
            if not results:
                self.after(0, lambda: self._log("No problem/disabled devices to initiate."))
            for name, msg, ok in results:
                flag = "OK" if ok else "FAIL"
                self.after(0, lambda n=name, m=msg, f=flag: self._log(f"  [{f}] {n}: {m}"))
            self.devices = []
            refreshed = core.scan_devices()
            self.devices = refreshed
            self.after(0, lambda: self._fill_tree(refreshed, problems_only=True))

        self._run_async("Initiating stuck drivers…", work)

    def do_detect(self) -> None:
        def work() -> None:
            hw = core.detect_hardware()
            self._hw = hw
            pretty = json.dumps(hw, indent=2)
            self.after(0, lambda: self._log(pretty))

        self._run_async("Detecting OEM / GPU…", work)

    def do_list_updates(self) -> None:
        def work() -> None:
            data = core.list_driver_updates()
            count = int(data.get("Count") or 0)
            self.after(0, lambda: self._log(f"Found {count} Windows Update driver package(s)."))
            for u in data.get("Updates") or []:
                self.after(
                    0,
                    lambda u=u: self._log(f"  - {u.get('Title')} ({u.get('SizeMB')} MB)"),
                )

        self._run_async("Checking Windows Update…", work)

    def do_update_wu(self) -> None:
        if not self._require_admin():
            return
        if not self._confirm("Install available Windows Update drivers?\nThis can take several minutes."):
            return

        def work() -> None:
            out = core.update_all_drivers(include_vendors=False)
            self.after(0, lambda: self._log(out))
            self.devices = []

        self._run_async("Updating via Windows Update…", work)

    def do_update_vendors(self) -> None:
        if not self._require_admin():
            return
        if not self._confirm(
            "Run OEM/GPU vendor updaters (Lenovo/Dell/HP/Intel/NVIDIA/AMD as detected)?"
        ):
            return

        def work() -> None:
            out = core.update_vendor_drivers(self._hw)
            self.after(0, lambda: self._log(out))
            self.devices = []

        self._run_async("Updating OEM / GPU vendors…", work)

    def do_update_all(self) -> None:
        if not self._require_admin():
            return
        if not self._confirm(
            "Run full update: Windows Update drivers + OEM/GPU vendors?\nThis can take a long time."
        ):
            return

        def work() -> None:
            out = core.update_all_drivers(include_vendors=True)
            self.after(0, lambda: self._log(out))
            self.devices = []

        self._run_async("Full driver update…", work)

    def do_export(self) -> None:
        path = filedialog.asksaveasfilename(
            title="Export device scan",
            defaultextension=".json",
            filetypes=[("JSON", "*.json"), ("All files", "*.*")],
            initialfile="drivers_scan.json",
        )
        if not path:
            return

        def work() -> None:
            devices = self._ensure_scan()
            with open(path, "w", encoding="utf-8") as fh:
                json.dump([asdict(d) for d in devices], fh, indent=2)
            self.after(0, lambda: self._log(f"Exported {len(devices)} devices → {path}"))

        self._run_async("Exporting JSON…", work)


def run_gui() -> int:
    # Avoid blurry UI on high-DPI Windows
    if sys.platform == "win32":
        try:
            core.ctypes.windll.shcore.SetProcessDpiAwareness(1)
        except Exception:
            try:
                core.ctypes.windll.user32.SetProcessDPIAware()
            except Exception:
                pass
    app = DriverScanApp()
    app.mainloop()
    return 0


if __name__ == "__main__":
    raise SystemExit(run_gui())
