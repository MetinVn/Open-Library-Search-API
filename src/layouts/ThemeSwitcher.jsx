import { Box, Button } from "@mui/material";

const ThemeSwitcher = ({ themeColor, setThemeColor }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        py: 2,
        px: { xs: 1, sm: 7 },
        display: "flex",
        gap: { xs: 1, sm: 2 },
        justifyContent: "flex-end",
        bgcolor: themeColor === "dark" ? "#1F2937" : "#bee3db",
        zIndex: 10,
      }}
    >
      <Button onClick={() => setThemeColor("light")} variant="outlined">
        Light Mode
      </Button>
      <Button onClick={() => setThemeColor("dark")} variant="outlined">
        Night Mode
      </Button>
    </Box>
  );
};
export default ThemeSwitcher;
