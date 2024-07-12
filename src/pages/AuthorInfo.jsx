import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Link as MuiLink,
  Container,
} from "@mui/material";

function AuthorInfo() {
  const { authorKey } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!authorKey) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`https://openlibrary.org/authors/${authorKey}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("*********Author Info Triggered*********");
        setAuthor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [authorKey]);

  const renderBio = (bio) => {
    if (typeof bio === "string") {
      return bio;
    } else if (Array.isArray(bio)) {
      return bio.map((b, index) => (
        <Typography key={index}>{b.value}</Typography>
      ));
    } else if (bio && bio.type === "string") {
      return bio.value;
    } else {
      return "No bio available.";
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        padding: "30px",
        width: "100%",
        height: "100vh",
        transition: "background-color 0.3s",
        backgroundColor: "#1E3A8A",
      }}>
      {loading ? (
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography sx={{ textAlign: "center", color: "white" }}>
          Error loading author information
        </Typography>
      ) : (
        <>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
            {author?.name || "Unknown Author"}
          </Typography>
          <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
            Born: {author?.birth_date || "No birth date info"}
          </Typography>
          <Box sx={{ color: "white", fontSize: "0.875rem" }}>
            Bio: {renderBio(author?.bio) || "No bio available"}
          </Box>
          <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
            Wikipedia:{" "}
            {author?.wikipedia ? (
              <MuiLink
                sx={{ textDecoration: "underline" }}
                href={author.wikipedia}
                target="_blank"
                rel="noopener noreferrer">
                {author.wikipedia}
              </MuiLink>
            ) : (
              "No Wikipedia link available"
            )}
          </Typography>
          <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
            Official Site:{" "}
            {author?.links &&
            Array.isArray(author.links) &&
            author.links.length > 0 ? (
              <MuiLink
                sx={{ textDecoration: "underline" }}
                href={author.links[0].url}
                target="_blank"
                rel="noopener noreferrer">
                {author.links[0].title}
              </MuiLink>
            ) : (
              "No official site available"
            )}
          </Typography>
        </>
      )}
    </Container>
  );
}

export default AuthorInfo;
