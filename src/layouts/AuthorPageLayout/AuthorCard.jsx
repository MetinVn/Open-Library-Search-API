import { Link } from "react-router-dom";
import { Box, Typography, Chip } from "@mui/material";
import { ROUTES } from "../../routes/routes";
import useTheme from "../../hooks/useTheme";
import { getClassByCount, getValueCount } from "../../functions/CalcCounts";

const AuthorCard = ({ author }) => {
  const [themeColor] = useTheme();

  return (
    <Link to={ROUTES.AUTHOR_DETAILS.replace(":author_key", author.key)} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: 1,
          borderColor: themeColor === "dark" ? "success.main" : "primary.main",
          bgcolor: themeColor === "dark" ? "#1A2027" : "white",
          color: themeColor === "dark" ? "white" : "black",
          transition: "0.3s",
          "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
          height: "100%",
        }}
      >
        <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
          {author.name}
        </Typography>

        {author.birth_date && (
          <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.8 }}>
            Born: {author.birth_date}
            {author.death_date && ` - Died: ${author.death_date}`}
          </Typography>
        )}

        {author.top_work && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            **Top Work:** {author.top_work}
          </Typography>
        )}

        {author.ratings_average && (
          <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
            **Average Rating:** {author.ratings_average.toFixed(2)} ({author.ratings_count} votes)
          </Typography>
        )}

        <Typography variant="body2">
          **Works:**
          <span className={getClassByCount(getValueCount(author.work_count))}>{getValueCount(author.work_count)}</span>
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: "bold" }}>
            Reading Stats:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {author.want_to_read_count > 0 && (
              <Chip
                label={`Want to Read: ${getValueCount(author.want_to_read_count)}`}
                variant="outlined"
                size="small"
                sx={{
                  color: themeColor === "dark" ? "#64FFDA" : "#1976D2",
                  borderColor: themeColor === "dark" ? "#64FFDA" : "#1976D2",
                  fontWeight: "bold",
                }}
              />
            )}
            {author.currently_reading_count > 0 && (
              <Chip
                label={`Reading: ${getValueCount(author.currently_reading_count)}`}
                variant="outlined"
                size="small"
                sx={{
                  color: themeColor === "dark" ? "#FFD700" : "#FFC107",
                  borderColor: themeColor === "dark" ? "#FFD700" : "#FFC107",
                  fontWeight: "bold",
                }}
              />
            )}
            {author.already_read_count > 0 && (
              <Chip
                label={`Read: ${getValueCount(author.already_read_count)}`}
                variant="outlined"
                size="small"
                sx={{
                  color: themeColor === "dark" ? "#228B22" : "#388E3C",
                  borderColor: themeColor === "dark" ? "#228B22" : "#388E3C",
                  fontWeight: "bold",
                }}
              />
            )}
          </Box>
        </Box>

        {author.top_subjects?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.5,
                fontWeight: "bold",
                color: themeColor === "dark" ? "white" : "black",
              }}
            >
              Top Subjects:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {author.top_subjects.slice(0, 3).map((subject, index) => (
                <Chip
                  sx={{ color: themeColor === "dark" ? "white" : "black" }}
                  key={index}
                  label={subject}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Link>
  );
};

export default AuthorCard;
