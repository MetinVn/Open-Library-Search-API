import { Box, Typography, CircularProgress } from "@mui/material";
import useTheme from "../hooks/useTheme";

export const PageLoader = ({ message }) => {
  const [themeColor] = useTheme();

  return (
    <Box
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        minWidth: "100vw",
        alignItems: "center",
        bgcolor: themeColor === "dark" ? "#1F2937" : "#bee3db",
        color: themeColor === "dark" ? "#fff" : "#000",
        transition: "background-color 0.3s, color 0.3s",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {message}
      </Typography>
      <CircularProgress color={themeColor === "dark" ? "inherit" : "primary"} />
    </Box>
  );
};
export default PageLoader;
