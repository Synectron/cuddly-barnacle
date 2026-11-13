"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { siteConfig } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <Box component="main" sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <SiteHeader />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, flex: 1 }}>
        <Typography variant="overline" color="primary">
          Legal
        </Typography>
        <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: "2.6rem", md: "3.8rem" } }}>
          Privacy
        </Typography>
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.75 }}>
            The DriverScan website is a static download page. It does not require an account and does
            not intentionally collect personal information.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.75 }}>
            The Windows EXE runs locally. Update flows may contact Microsoft Windows Update and
            official OEM/GPU vendor services (Lenovo, Dell, HP, Intel, NVIDIA, AMD). Those services
            follow their own privacy policies.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.75 }}>
            If Vercel analytics are enabled later, they would see standard request metadata only. No
            driver inventory is uploaded to Opuskiln by the current build.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.75 }}>
            Questions:{" "}
            <Link href={siteConfig.orgUrl} sx={{ fontWeight: 700 }}>
              {siteConfig.orgUrl}
            </Link>
          </Typography>
        </Stack>
        <Button
          component={NextLink}
          href="/"
          startIcon={<ArrowBackIcon />}
          color="primary"
          sx={{ mt: 5 }}
        >
          Back home
        </Button>
      </Container>
      <SiteFooter />
    </Box>
  );
}
