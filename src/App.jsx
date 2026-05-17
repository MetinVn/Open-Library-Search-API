import { Container, Typography, Button, Box, Card, CardContent, CircularProgress, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useIndexedDB, { DB_NAME, SHOWCASE_STORE } from "./hooks/useIndexDB";
import { useEffect, useState, useCallback } from "react";
import { ROUTES } from "./routes/routes";

const FEATURED_AUTHORS = ["jane austen", "charles dickens", "mark twain"];
const BOOK_CACHE_KEY = "cachedShowcaseBooks";
const IMAGE_SIZE = "M";

export function App() {
  const { storeData, retrieveData, getImage, cacheImage } = useIndexedDB(DB_NAME);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [coverImages, setCoverImages] = useState({});

  const fetchFeaturedBooks = useCallback(async () => {
    const promises = FEATURED_AUTHORS.map(async (author) => {
      try {
        const res = await fetch(`https://openlibrary.org/search.json?author=${author}&limit=1`);
        const data = await res.json();
        return data.docs[0];
      } catch (error) {
        console.error(`Failed to fetch book for author ${author}:`, error);
        return null;
      }
    });

    const results = (await Promise.all(promises)).filter(Boolean);

    await storeData(SHOWCASE_STORE, BOOK_CACHE_KEY, results);
    return results;
  }, []);

  const fetchImages = useCallback(async (coverId) => {
    try {
      const cachedImageBlob = await getImage(coverId);

      if (cachedImageBlob) {
        console.log(`Image with ID ${coverId} loaded from IndexedDB cache.`);
        return URL.createObjectURL(cachedImageBlob);
      }

      const imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-${IMAGE_SIZE}.jpg`;
      const res = await fetch(imageUrl);
      console.log(`Image with ID ${coverId} fetched from the network.`);

      const imageBlob = await res.blob();

      await cacheImage(coverId, imageBlob);

      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error(`Failed to fetch and cache image for cover ID ${coverId}:`, error);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsFeaturedLoading(true);

      const cachedBooks = await retrieveData(SHOWCASE_STORE, BOOK_CACHE_KEY);
      const booksToProcess = cachedBooks?.length > 0 ? cachedBooks : await fetchFeaturedBooks();

      setFeaturedBooks(booksToProcess);

      const imagePromises = booksToProcess.map(async (book) => {
        if (book?.cover_i) {
          const imageUrl = await fetchImages(book.cover_i);
          if (imageUrl) {
            return { id: book.cover_i, url: imageUrl };
          }
        }
        return null;
      });

      const loadedImages = (await Promise.all(imagePromises)).filter(Boolean);

      const newCoverImages = loadedImages.reduce((acc, curr) => {
        acc[curr.id] = curr.url;
        return acc;
      }, {});

      setCoverImages(newCoverImages);
      setIsFeaturedLoading(false);
    };

    loadInitialData();
    return () => {
      Object.values(coverImages).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1E3A8A 30%, #3B82F6 90%)",
        color: "white",
        textAlign: "center",
        p: 4,
      }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Discover Worlds Beyond Pages{" "}
        </Typography>
        <Typography variant="body1" component="p" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
          Every book has a story, every author a journey. Explore classics, discover hidden gems, and dive into the
          endless collection powered by the Open Library.
        </Typography>
      </motion.div>
      {/* Featured authors preview */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
          mb: 4,
        }}
      >
        {isFeaturedLoading ? (
          <CircularProgress color="inherit" />
        ) : (
          featuredBooks.map((book, index) => (
            <motion.div
              key={book.key || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.2 }}
            >
              <Card sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white", width: 220, overflow: "hidden" }}>
                <Link to={`/author/${book.author_key?.[0]}`}>
                  {coverImages[book?.cover_i] ? (
                    <CardMedia
                      component="img"
                      image={coverImages[book.cover_i]}
                      alt={`Cover of ${book.title}`}
                      sx={{ height: 250, objectFit: "contain", bgcolor: "rgba(255,255,255,0.8)" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 250,
                        bgcolor: "rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "white", px: 2, textAlign: "center" }}>
                        No Cover Available
                      </Typography>
                    </Box>
                  )}
                  <CardContent title={book.title} sx={{ textAlign: "left" }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                      {book.author_name?.[0] || "Unknown Author"}
                    </Typography>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))
        )}
      </Box>
      <motion.div whileHover={{ scale: 0.99 }}>
        <Button
          variant="contained"
          component={Link}
          to={ROUTES.SEARCH_BOOKS}
          color="info"
          size="large"
          sx={{ fontWeight: "bold", px: 4, py: 1.5 }}
        >
          Start Exploring
        </Button>
      </motion.div>
    </Container>
  );
}

export default App;
