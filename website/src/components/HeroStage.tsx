export function HeroStage() {
  return (
    <div className="relative h-full min-h-[340px] w-full overflow-hidden bg-stage md:min-h-full">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,232,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,232,235,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 70% 30%, rgba(11,127,134,0.35), transparent 60%), linear-gradient(160deg, #0f2f34 0%, #123a40 50%, #0b2428 100%)",
        }}
      />

      <svg
        className="float-soft absolute inset-0 h-full w-full"
        viewBox="0 0 720 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="90" y="120" width="540" height="460" rx="18" stroke="#c9e8eb" strokeOpacity="0.28" />
        <rect x="130" y="170" width="180" height="120" rx="10" stroke="#7ad7d4" strokeOpacity="0.55" />
        <rect x="340" y="170" width="250" height="70" rx="10" stroke="#7ad7d4" strokeOpacity="0.4" />
        <rect x="340" y="260" width="120" height="120" rx="10" stroke="#7ad7d4" strokeOpacity="0.45" />
        <rect x="480" y="260" width="110" height="120" rx="10" stroke="#7ad7d4" strokeOpacity="0.35" />
        <rect x="130" y="320" width="180" height="200" rx="10" stroke="#7ad7d4" strokeOpacity="0.35" />
        <rect x="340" y="410" width="250" height="110" rx="10" stroke="#7ad7d4" strokeOpacity="0.4" />

        <path
          className="trace-draw"
          d="M160 230 H280 V380 H420 V300 H530 V460 H390"
          stroke="#2fd6c4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="160" cy="230" r="5" fill="#2fd6c4" />
        <circle cx="390" cy="460" r="5" fill="#2fd6c4" />
        <circle cx="280" cy="380" r="4" fill="#9be8e0" />
        <circle cx="420" cy="300" r="4" fill="#9be8e0" />
      </svg>

      <div
        aria-hidden
        className="scan-beam pointer-events-none absolute inset-y-0 w-[18%] bg-gradient-to-r from-transparent via-[#7ad7d4]/35 to-transparent"
      />
    </div>
  );
}
