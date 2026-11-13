"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#0f6cbd",
      dark: "#0a4f8c",
      light: "#4f93d4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#101820",
      contrastText: "#f4f7fa",
    },
    success: { main: "#2f9b6a" },
    warning: { main: "#c28a14" },
    background: {
      default: "#f3f5f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#0e151b",
      secondary: "#5d6b78",
    },
    divider: "rgba(14, 21, 27, 0.12)",
  },
  typography: {
    fontFamily: "var(--font-body), 'Plus Jakarta Sans', system-ui, sans-serif",
    h1: {
      fontFamily: "var(--font-display), 'Bricolage Grotesque', system-ui, sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.04em",
      lineHeight: 1.12,
      overflow: "visible",
    },
    h2: {
      fontFamily: "var(--font-display), 'Bricolage Grotesque', system-ui, sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.15,
    },
    h3: {
      fontFamily: "var(--font-display), 'Bricolage Grotesque', system-ui, sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.2,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    overline: {
      fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
      letterSpacing: "0.22em",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 8,
          minHeight: 48,
          px: 2.5,
          boxShadow: "none",
          // cssVariables can drop contrastText on secondary; force readable CTAs
          ...(ownerState.variant === "contained" &&
            ownerState.color === "secondary" && {
              color: "#f4f7fa",
              backgroundColor: "#101820",
              "&:hover": {
                color: "#f4f7fa",
                backgroundColor: "#1a2733",
                boxShadow: "none",
              },
            }),
          ...(ownerState.variant === "outlined" &&
            ownerState.color === "secondary" && {
              color: "#101820",
              borderColor: "rgba(16, 24, 32, 0.55)",
              "&:hover": {
                borderColor: "#101820",
                backgroundColor: "rgba(16, 24, 32, 0.04)",
              },
            }),
        }),
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f3f5f8",
        },
      },
    },
  },
});
