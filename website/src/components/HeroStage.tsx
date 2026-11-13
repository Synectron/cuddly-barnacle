"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/system";

const lines = [
  { color: "text.secondary", text: "C:\\> DriverScanInit.exe --update" },
  { color: "success.main", text: "OK   Intel Iris Xe Graphics" },
  { color: "success.main", text: "OK   NVMe Storage Controller" },
  { color: "warning.main", text: "FIX  Hidden network adapter · initiating" },
  { color: "success.main", text: "UPD  Windows Update drivers · 3 queued" },
  { color: "success.main", text: "UPD  Lenovo System Update · running" },
  { color: "text.secondary", text: "Done. Reboot if prompted." },
] as const;

const scan = keyframes`
  0% { top: 8%; opacity: 0; }
  10% { opacity: 0.85; }
  90% { opacity: 0.45; }
  100% { top: 90%; opacity: 0; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const blink = keyframes`
  0%, 45% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export function HeroStage() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        minHeight: { xs: 460, md: "100%" },
        overflow: "hidden",
        color: "#c5d0da",
        bgcolor: "secondary.main",
        backgroundImage:
          "radial-gradient(900px 520px at 80% 10%, rgba(15,108,189,0.30), transparent 55%), linear-gradient(165deg, #101820 0%, #15202b 48%, #0d141c 100%)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          backgroundImage:
            "linear-gradient(rgba(197,208,218,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(197,208,218,0.12) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(ellipse at 60% 40%, black 20%, transparent 75%)",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, #5eb1ff, transparent)",
          animation: `${scan} 4.2s ease-in-out infinite`,
        }}
      />

      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          boxSizing: "border-box",
          p: { xs: 3, md: 4, lg: 5 },
          gap: { xs: 3, md: 2 },
          justifyContent: { xs: "flex-start", md: "center" },
        }}
      >
        <Stack direction="row" sx={{ justifyContent: "space-between", flexShrink: 0 }}>
          <Typography
            variant="overline"
            sx={{ color: "rgba(197,208,218,0.55)", letterSpacing: "0.22em" }}
          >
            DriverScan console
          </Typography>
          <Typography variant="overline" sx={{ color: "#5eb1ff", letterSpacing: "0.22em" }}>
            admin
          </Typography>
        </Stack>

        <Stack spacing={{ xs: 1, md: 1.1 }} sx={{ flexShrink: 1, minHeight: 0 }}>
          {lines.map((line, i) => (
            <Typography
              key={line.text}
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                lineHeight: 1.4,
                color: line.color,
                opacity: 0,
                overflowWrap: "anywhere",
                animation: `${fadeUp} 0.55s ease forwards`,
                animationDelay: `${0.35 + i * 0.2}s`,
              }}
            >
              {line.text}
            </Typography>
          ))}
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              color: "rgba(197,208,218,0.8)",
              opacity: 0,
              animation: `${fadeUp} 0.55s ease forwards`,
              animationDelay: "1.75s",
            }}
          >
            C:\\&gt;{" "}
            <Box
              component="span"
              aria-hidden
              sx={{
                display: "inline-block",
                width: "0.55ch",
                height: "1.05em",
                ml: "2px",
                verticalAlign: "text-bottom",
                bgcolor: "#5eb1ff",
                animation: `${blink} 1.1s steps(1) infinite`,
              }}
            />
          </Typography>
        </Stack>

        <Typography
          variant="overline"
          sx={{
            color: "rgba(197,208,218,0.45)",
            letterSpacing: "0.18em",
            flexShrink: 0,
            pt: { md: 1 },
          }}
        >
          Windows 10 / 11 · OEM + GPU vendors
        </Typography>
      </Stack>
    </Box>
  );
}
