import { Container, Typography, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { openDB } from "idb";
export default function Welcome() {
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    clearIndexedDB();
  }, []);

  const clearIndexedDB = async () => {
    const db = await openDB("book-search-db", 1, {
      upgrade(db) {
        db.createObjectStore("keyval");
      },
    });

    const tx = db.transaction("keyval", "readwrite");
    const store = tx.objectStore("keyval");
    await store.clear();
    await tx.done;
    console.log("IndexedDB database cleared successfully.");
  };
  function loading() {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
      navigate("/home/books");
    }, 1200);
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#336699",
        color: "#FFFFFF",
        transition: "background-color 0.3s",
      }}>
      {load ? (
        <CircularProgress color="inherit" />
      ) : (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <Typography variant="h3" gutterBottom>
            Welcome to Open Library Search API Project
          </Typography>
          <Typography variant="body1" gutterBottom>
            Explore books and authors with the power of Open Library!
          </Typography>
          <Button
            onClick={loading}
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: "2rem" }}>
            Proceed to Library
          </Button>
        </div>
      )}
    </Container>
  );
}
