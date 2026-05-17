import { Box, Typography, Chip } from "@mui/material";
import useTheme from "../../hooks/useTheme";

const BookCard = ({ item, themeColor }) => {
  const [currentTheme] = useTheme();
  const color = themeColor || currentTheme;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: color === "dark" ? "success.main" : "primary.main",
        bgcolor: color === "dark" ? "#1A2027" : "white",
        color: color === "dark" ? "white" : "black",
        transition: "0.3s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
        height: "100%",
      }}
    >
      <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
        {item.title}
      </Typography>
      {item.author_name && (
        <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.8 }}>
          By: {item.author_name.join(", ")}
        </Typography>
      )}
      {item.first_publish_year && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          First Published: {item.first_publish_year}
        </Typography>
      )}
      {item.subject && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            Subjects:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {item.subject.slice(0, 3).map((subject, idx) => (
              <Chip
                key={idx}
                label={subject}
                size="small"
                variant="outlined"
                sx={{ color: color === "dark" ? "white" : "black" }}
              />
            ))}
          </Box>
        </Box>
      )}
      {item.edition_count && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Editions: {item.edition_count}
        </Typography>
      )}
    </Box>
  );
};

export default BookCard;
