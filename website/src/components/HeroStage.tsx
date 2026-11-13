const lines = [
  { tone: "muted", text: "C:\\> DriverScanInit.exe --update" },
  { tone: "ok", text: "OK   Intel Iris Xe Graphics" },
  { tone: "ok", text: "OK   NVMe Storage Controller" },
  { tone: "warn", text: "FIX  Hidden network adapter · initiating" },
  { tone: "ok", text: "UPD  Windows Update drivers · 3 queued" },
  { tone: "ok", text: "UPD  Lenovo System Update · running" },
  { tone: "muted", text: "Done. Reboot if prompted." },
] as const;

export function HeroStage() {
  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-stage text-term md:min-h-full">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 80% 10%, rgba(15,108,189,0.28), transparent 55%), linear-gradient(165deg, #101820 0%, #15202b 48%, #0d141c 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(197,208,218,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(197,208,218,0.12) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(ellipse at 60% 40%, black 20%, transparent 75%)",
        }}
      />
      <div aria-hidden className="noise absolute inset-0" />
      <div aria-hidden className="scan-y" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-term/55">
          <span>DriverScan console</span>
          <span className="text-[#5eb1ff]">admin</span>
        </div>

        <div className="my-10 space-y-3 font-mono text-[0.92rem] leading-relaxed sm:text-[1rem] md:my-0">
          {lines.map((line) => (
            <p
              key={line.text}
              className={`term-line ${
                line.tone === "ok"
                  ? "text-ok"
                  : line.tone === "warn"
                    ? "text-warn"
                    : "text-term/70"
              }`}
            >
              {line.text}
            </p>
          ))}
          <p className="term-line text-term/80">
            C:\\&gt; <span className="caret" aria-hidden />
          </p>
        </div>

        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-term/45">
          Windows 10 / 11 · OEM + GPU vendors
        </div>
      </div>
    </div>
  );
}
