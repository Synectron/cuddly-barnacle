"use client";

import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

const steps = [
  {
    title: "Download the EXE",
    body: `Get DriverScanInit.exe from the homepage (v${siteConfig.version}).`,
  },
  {
    title: "Run as Administrator",
    body: "Right-click → Run as administrator. Elevation is required to initiate and update drivers.",
  },
  {
    title: "Update everything",
    body: "Menu option 8, or DriverScanInit.exe --update for Windows Update plus OEM/GPU vendors.",
  },
  {
    title: "Reboot if prompted",
    body: "Chipset, BIOS, and GPU packages often need a restart before they finish loading.",
  },
];

export default function GuidePage() {
  return (
    <Box component="main" sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <SiteHeader />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, flex: 1 }}>
        <Typography variant="overline" color="primary">
          Guide
        </Typography>
        <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: "2.6rem", md: "3.8rem" } }}>
          How to run DriverScan
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, fontSize: "1.15rem", lineHeight: 1.7 }}>
          Windows 10/11. Keep internet on so Windows Update and vendor tools can download packages.
        </Typography>

        <Stack spacing={4} sx={{ mt: 6 }}>
          {steps.map((step, i) => (
            <Box key={step.title} sx={{ borderTop: "1px solid", borderColor: "divider", pt: 3 }}>
              <Typography variant="overline" color="primary">
                Step {String(i + 1).padStart(2, "0")}
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontSize: "1.8rem" }}>
                {step.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.25, lineHeight: 1.7 }}>
                {step.body}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Paper
          variant="outlined"
          sx={{ mt: 6, p: { xs: 2.5, md: 3.5 }, bgcolor: "rgba(255,255,255,0.7)" }}
        >
          <Typography variant="h3" sx={{ fontSize: "1.25rem" }}>
            Useful commands
          </Typography>
          <Box
            component="pre"
            sx={{
              mt: 2,
              m: 0,
              overflowX: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              color: "text.primary",
            }}
          >
{`DriverScanInit.exe --detect
DriverScanInit.exe --list-updates
DriverScanInit.exe --update-wu
DriverScanInit.exe --update-vendors
DriverScanInit.exe --update`}
          </Box>
        </Paper>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 5, alignItems: "center" }}>
          <Button
            component="a"
            href={siteConfig.downloadPath}
            download
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
          >
            Download DriverScanInit.exe
          </Button>
          <Button component={NextLink} href="/" startIcon={<ArrowBackIcon />} color="primary">
            Back home
          </Button>
        </Stack>
      </Container>
      <SiteFooter />
    </Box>
  );
}
