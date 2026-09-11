import { createTheme } from "@mui/material/styles";

// Design tokens for Ooro Store
// Background: cool off-white with a green undertone (grocery paper, not cream/terracotta cliché)
// Primary: deep evergreen (produce, freshness)
// Accent: marigold gold — "Ooro" nods to gold
// Display type: Fraunces (characterful serif, used sparingly for headings)
// Body/data type: Inter (clean, legible in dense tables)

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1F4D3A", light: "#3B6E58", dark: "#123526", contrastText: "#FAFBF8" },
    secondary: { main: "#E3A008", light: "#F0BE4C", dark: "#B67E04", contrastText: "#22282B" },
    background: { default: "#F5F7F1", paper: "#FFFFFF" },
    text: { primary: "#22282B", secondary: "#5A625B" },
    success: { main: "#2E7D5B" },
    warning: { main: "#E3A008" },
    error: { main: "#C1443C" },
    divider: "#E1E5DC",
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", -apple-system, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "none", borderBottom: "1px solid #E1E5DC" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});
