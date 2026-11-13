"use client";

import DownloadIcon from "@mui/icons-material/Download";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { HeroStage } from "@/components/HeroStage";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

const steps = [
  {
    n: "01",
    title: "Scan",
    body: "Map present PnP devices, status codes, and driver versions before you change anything.",
  },
  {
    n: "02",
    title: "Initiate",
    body: "Enable and start problem or disabled devices Windows left half-asleep.",
  },
  {
    n: "03",
    title: "Update",
    body: "Install Windows Update drivers, then kick Lenovo, Dell, HP, Intel, NVIDIA, or AMD tools.",
  },
];

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
    >
      <SiteHeader />

      <Box
        sx={{
          position: "relative",
          minHeight: { md: "min(40rem, calc(100svh - 72px))" },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(22rem, 1.1fr) 0.9fr",
          },
          overflow: "visible",
          alignItems: "stretch",
          background:
            "radial-gradient(900px 500px at 8% 0%, rgba(15,108,189,0.14), transparent 50%), linear-gradient(180deg, #f8fafc 0%, #f3f5f8 42%, #e8eef5 100%)",
        }}
      >
        <Stack
          sx={{
            justifyContent: "center",
            px: { xs: 3, md: 4, lg: 5 },
            py: { xs: 5, md: 4, lg: 6 },
            pl: { lg: "max(2rem, calc((100vw - 72rem) / 2 + 2rem))" },
            pr: { md: 4, lg: 6 },
            minWidth: 0,
            overflow: "visible",
          }}
        >
          <Typography variant="overline" color="primary" sx={{ mb: 1.5 }}>
            Opuskiln utility
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "clamp(2.6rem, 11vw, 3.5rem)",
                sm: "clamp(3.25rem, 8vw, 4.5rem)",
                md: "clamp(3.5rem, 4.6vw, 5rem)",
              },
              color: "text.primary",
              lineHeight: 1.05,
              py: "0.04em",
              overflow: "visible",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {siteConfig.name}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              mt: 3,
              maxWidth: 460,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              lineHeight: 1.6,
            }}
          >
            Scan stuck devices, start dead drivers, and pull the latest updates
            from Windows and the big OEM/GPU vendors.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 4 }}
          >
            <Button
              component="a"
              href={siteConfig.downloadPath}
              download
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<DownloadIcon />}
            >
              Download for Windows
            </Button>
            <Button
              component={NextLink}
              href="/guide"
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<MenuBookOutlinedIcon />}
            >
              How to run
            </Button>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 2.5,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            v{siteConfig.version} · Desktop UI · Run as Administrator for
            updates
          </Typography>
        </Stack>

        <Box sx={{ minHeight: { xs: 460, md: "auto" }, minWidth: 0 }}>
          <HeroStage />
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary">
            Workflow
          </Typography>
          <Typography
            variant="h2"
            sx={{
              mt: 1.5,
              maxWidth: 640,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Three moves. One elevated EXE.
          </Typography>
          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mt: 2 }}>
            {steps.map((step) => (
              <Grid key={step.n} size={{ xs: 12, md: 4 }}>
                <Typography variant="overline" color="primary">
                  {step.n}
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, fontSize: "2rem" }}>
                  {step.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 1.5, maxWidth: 360, lineHeight: 1.7 }}
                >
                  {step.body}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "secondary.main",
          color: "#edf2f7",
          backgroundImage:
            "radial-gradient(700px 320px at 90% 20%, rgba(15,108,189,0.35), transparent 60%)",
          py: { xs: 8, md: 10 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: { md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, color: "inherit" }}
            >
              Grab the EXE and run elevated.
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#b7c3cf" }}>
              Free download. No account. Use{" "}
              <Box
                component="span"
                sx={{ fontFamily: "var(--font-mono)", color: "#9ec5ef" }}
              >
                --update
              </Box>{" "}
              when you want Windows Update plus vendor updaters in one pass.
            </Typography>
          </Box>
          <Button
            component="a"
            href={siteConfig.downloadPath}
            download
            variant="contained"
            size="large"
            startIcon={<DownloadIcon />}
            sx={{
              flexShrink: 0,
              bgcolor: "#ffffff",
              color: "#101820",
              "&:hover": { bgcolor: "#0f6cbd", color: "#ffffff" },
            }}
          >
            Get DriverScanInit.exe
          </Button>
        </Container>
      </Box>

      <SiteFooter />
    </Box>
  );
}
