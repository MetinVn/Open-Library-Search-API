import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Link as MuiLink, Paper, Button } from "@mui/material";
import { fetchWithSignal } from "../../utils/fetchWithSignal";
import useTheme from "../../hooks/useTheme";
import Sidebar from "../../components/Sidebar";

function AuthorDetails() {
  const { author_key } = useParams();
  const [themeColor] = useTheme();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const controllerRef = useRef(null);

  const fetchAuthorData = useCallback(async () => {
    setLoading(true);
    setError(false);

    if (!author_key) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const url = `https://openlibrary.org/authors/${author_key}.json`;
      const response = await fetchWithSignal(url, controllerRef, setShowWaitMessage);

      setAuthor(response);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch author data:", err);
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [author_key]);

  useEffect(() => {
    fetchAuthorData();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchAuthorData]);

  const getBioText = (bio) => {
    if (typeof bio === "string") return bio;
    if (bio && typeof bio.value === "string") return bio.value;
    return "No bio available.";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#1E3A8A",
        py: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sidebar colors={themeColor} />
      <Paper
        elevation={24}
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: 800,
          width: { xs: "90%", md: "100%" },
          mx: "auto",
          bgcolor: "white",
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "primary.main" }} />

            <Typography variant="body1">Loading Author Information</Typography>
            {showWaitMessage && (
              <Box
                sx={{
                  border: 1,
                  borderColor: themeColor === "dark" ? "error.main" : "primary.main",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography>Response is taking longer than usual...</Typography>
                <Button onClick={() => controllerRef.current?.abort()} color="error">
                  Cancel Request
                </Button>
              </Box>
            )}
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" sx={{ textAlign: "center", width: "100%" }}>
            Error loading author information or author not found.
          </Typography>
        ) : (
          <>
            {author?.photos?.length > 0 && (
              <Box
                component="img"
                src={`https://covers.openlibrary.org/b/id/${author.photos[0]}-M.jpg`}
                alt={`Photograph of ${author.name}`}
                sx={{
                  borderRadius: "3%",
                  width: 150,
                  height: 150,
                  objectFit: "contain",
                  mb: 2,
                  border: `2px solid`,
                  borderColor: themeColor === "dark" ? "white" : "black",
                }}
              />
            )}

            <Typography
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
                fontWeight: "bold",
              }}
            >
              {author?.name || "Unknown Author"}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                color: "text.secondary",
              }}
            >
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                Born:
              </Typography>{" "}
              {author?.birth_date || "N/A"}
            </Typography>

            {author?.death_date && (
              <Typography
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  color: "text.secondary",
                }}
              >
                <Typography component="span" sx={{ fontWeight: "bold" }}>
                  Died:
                </Typography>{" "}
                {author.death_date}
              </Typography>
            )}

            <Typography sx={{ mt: 2, fontSize: { xs: "0.60rem", sm: "0.90rem", md: "1.15rem" } }}>
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                Bio:
              </Typography>{" "}
              {getBioText(author?.bio)}
            </Typography>

            {author?.wikipedia && (
              <Typography
                sx={{
                  mt: 2,
                  fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                }}
              >
                <Typography component="span" sx={{ fontWeight: "bold" }}>
                  Wikipedia:
                </Typography>{" "}
                <MuiLink href={author.wikipedia} target="_blank" rel="noopener noreferrer">
                  {author.wikipedia}
                </MuiLink>
              </Typography>
            )}

            {author?.links?.length > 0 && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                }}
              >
                <Typography component="span" sx={{ fontWeight: "bold" }}>
                  Official Site:
                </Typography>{" "}
                <MuiLink href={author.links[0].url} target="_blank" rel="noopener noreferrer">
                  {author.links[0].title || "Link"}
                </MuiLink>
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

export default AuthorDetails;
