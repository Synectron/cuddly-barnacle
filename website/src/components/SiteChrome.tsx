"use client";

import DownloadIcon from "@mui/icons-material/Download";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(10px)",
        bgcolor: "rgba(243,245,248,0.85)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72, gap: 2 }}>
          <Typography
            component={NextLink}
            href="/"
            variant="h6"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "text.primary",
              textDecoration: "none",
              mr: "auto",
            }}
          >
            {siteConfig.name}
          </Typography>
          <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: "center" }}>
            <Link
              component={NextLink}
              href="/guide"
              underline="hover"
              color="text.secondary"
              sx={{ display: { xs: "none", sm: "inline" }, fontWeight: 600 }}
            >
              Guide
            </Link>
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noreferrer"
              underline="hover"
              color="text.secondary"
              sx={{ display: { xs: "none", sm: "inline" }, fontWeight: 600 }}
            >
              GitHub
            </Link>
            <Button
              component="a"
              href={siteConfig.downloadPath}
              download
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<DownloadIcon />}
              sx={{ minHeight: 40 }}
            >
              Download
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export function SiteFooter() {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", py: 4 }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center" },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} {siteConfig.org}. {siteConfig.name} for Windows.
        </Typography>
        <Stack direction="row" spacing={3} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Link component={NextLink} href="/privacy" color="text.secondary" underline="hover">
            Privacy
          </Link>
          <Link component={NextLink} href="/guide" color="text.secondary" underline="hover">
            Guide
          </Link>
          <Link
            href={siteConfig.release}
            target="_blank"
            rel="noreferrer"
            color="text.secondary"
            underline="hover"
          >
            Releases
          </Link>
          <Link href="/sitemap.xml" color="text.secondary" underline="hover">
            Sitemap
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
