import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useTheme from "../../hooks/useTheme";
import { ROUTES } from "../../routes/routes";

export function NotFound() {
  const [themeColor] = useTheme();

  const isDark = themeColor === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: isDark ? "#1F2937" : "#f0f4f8",
        color: isDark ? "#fff" : "#111",
        transition: "background-color 0.3s, color 0.3s",
        textAlign: "center",
        p: 4,
      }}
    >
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Oops! Page not found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
          The page you are looking for doesn’t exist or has been moved. Let’s get you back on track.
        </Typography>
      </motion.div>

      <motion.div whileHover={{ scale: 0.95 }}>
        <Button
          component={Link}
          to={ROUTES.HOME}
          variant="contained"
          size="large"
          sx={{
            bgcolor: isDark ? "#3B82F6" : "#1E40AF",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            "&:hover": {
              bgcolor: isDark ? "#2563EB" : "#1E3A8A",
            },
          }}
        >
          Back to Home
        </Button>
      </motion.div>
    </Box>
  );
}
export default NotFound;
