import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button,
  Snackbar,
  TextField,
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import { openDB } from "idb";
import Sidebar from "../layouts/Sidebar";
import { getClassByCount, getValueCount } from "../Func/CalcCounts";

const dbPromise = openDB("book-search-db", 1, {
  upgrade(db) {
    db.createObjectStore("keyval");
  },
});

const storeData = async (key, val) => {
  const db = await dbPromise;
  return db.put("keyval", val, key);
};

const retrieveData = async (key) => {
  const db = await dbPromise;
  return db.get("keyval", key);
};

function AuthorSearch() {
  const [title, setTitle] = useState("");
  const [data, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearable, setClearable] = useState(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [visibleItems, setVisibleItems] = useState(10);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const [controller, setController] = useState(null);
  const [respHeader, setResponseHeader] = useState(null);

  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  const loadMore = () => {
    setVisibleItems((prev) => prev + 10);
  };

  const [themeColor, setThemeColor] = useState(
    localStorage.getItem("themeColor") || "light"
  );

  const setDarkMode = () => {
    document.documentElement.classList = "dark";
    setThemeColor("dark");
    localStorage.setItem("themeColor", "dark");
  };

  const setLightMode = () => {
    document.documentElement.classList = "light";
    setThemeColor("light");
    localStorage.setItem("themeColor", "light");
  };

  useEffect(() => {
    localStorage.setItem("themeColor", themeColor);
  }, [themeColor]);

  useEffect(() => {
    const init = async () => {
      const savedData = await retrieveData("searchResultsAuthor");
      const savedTitle = await retrieveData("searchResultsTextAuthor");
      if (savedData) {
        setClearable(true);
        setDatas(JSON.parse(savedData).docs);
        if (savedTitle) {
          inputRef.current.value = savedTitle;
        }
      }
    };
    init();
  }, []);

  async function getStoredQuery() {
    return await retrieveData("searchResultsTextAuthor");
  }

  const cleanContent = () => {
    setTitle("");
    setDatas([]);
    setResponseHeader(null);
    storeData("searchResultsAuthor", null);
    storeData("searchResultsTextAuthor", null);
    setClearable(false);
    console.log("Content Cleared!");
  };

  const check = async () => {
    const titleValue = inputRef.current.value;

    if (titleValue === "") {
      console.log("Empty query typed, not firing the function");
      setLoading(false);
      handleOpen("This field cannot be empty");
      return;
    }

    try {
      const storedQuery = await getStoredQuery();
      if (storedQuery === titleValue) {
        console.log("Same query already executed, skipping...");
        handleOpen("Same query already executed, skipping...");
        setLoading(false);
        return;
      }

      const abortController = new AbortController();
      setController(abortController);

      setLoading(true);
      setDatas([]);
      setResponseHeader(null);
      setClearable(false);

      const timer = setTimeout(() => {
        setShowWaitMessage(true);
      }, 8000);

      const response = await fetch(
        `https://openlibrary.org/search/authors.json?q=${titleValue}`,
        { signal: abortController.signal }
      );
      const resp = await response.json();
      clearTimeout(timer);
      setShowWaitMessage(false);

      console.log("********* Author Search Triggered *********");
      setDatas(resp.docs);
      setResponseHeader(resp.numFound);
      storeData("searchResultsAuthor", JSON.stringify(resp));
      storeData("searchResultsTextAuthor", titleValue);
      setClearable(true);
      console.log("Clearable: " + clearable);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request cancelled.");
      } else {
        console.error(error);
      }
      setLoading(false);
      setShowWaitMessage(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      check();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  const handleOpen = (message) => {
    setErrorMessage(message);
    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  const cancelRequest = () => {
    if (controller) {
      controller.abort();
    }
    setShowWaitMessage(false);
    setLoading(false);
  };

  const sortAuthorsAscending = () => {
    setDatas((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        if (a.name && b.name) {
          return a.name[0].localeCompare(b.name[0]);
        }
        return 0;
      });
      return sortedData;
    });
    console.log("Sorted Authors A to Z ");
  };

  const sortAuthorsDescending = () => {
    setDatas((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        if (a.name && b.name) {
          return b.name[0].localeCompare(a.name[0]);
        }
        return 0;
      });
      return sortedData;
    });
    console.log("Sorted Authors A to Z ");
  };

  const sortAuthorsByWorkCountAscending = () => {
    setDatas((prevData) => {
      const sortedByAlreadyRedCount = [...prevData].sort((a, b) => {
        const bookA = getValueCount(a.work_count);
        const bookB = getValueCount(b.work_count);
        return bookB - bookA;
      });
      return sortedByAlreadyRedCount;
    });
  };

  const sortAuthorsByWorkCountDescending = () => {
    setDatas((prevData) => {
      const sortedByAlreadyRedCount = [...prevData].sort((a, b) => {
        const bookA = getValueCount(a.work_count);
        const bookB = getValueCount(b.work_count);
        return bookA - bookB;
      });
      return sortedByAlreadyRedCount;
    });
  };
  return (
    <>
      <Sidebar colors={themeColor} />
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          minHeight: "100vh",
          height: "auto",
          bgcolor: themeColor === "dark" ? "#1F2937" : "#bee3db",
          transition: "background-color 0.3s",
          padding: "90px 0",
          margin: 0,
          width: "100%",
          maxWidth: "100vw",
        }}>
        <Box className="fixed w-full top-0 py-5 pr-5 flex gap-5 justify-end dark:bg-[#bee3db] bg-[#1F2937] z-10">
          <Button onClick={setLightMode} variant="outlined" color="primary">
            Light Mode
          </Button>
          <Button onClick={setDarkMode} variant="outlined" color="primary">
            Night Mode
          </Button>
        </Box>
        <Typography
          variant="h1"
          color={themeColor === "dark" ? "#64FFDA" : "#1976D2"}
          className="text-center mt-20 transition-colors duration-300">
          Search for Authors
        </Typography>
        <TextField
          inputRef={inputRef}
          value={title}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          label="Search for authors here"
          variant="outlined"
          sx={{
            width: "100%", // Adjusted width for responsiveness
            maxWidth: "350px", // Maximum width for larger screens
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: themeColor === "dark" ? "#64FFDA" : "#1976D2",
              },
              "&:hover fieldset": {
                borderColor:
                  themeColor === "dark" ? "#64FFDA" : "rgba(0, 0, 0, 0.37)",
              },
              "&.Mui-focused fieldset": {
                borderColor: themeColor === "dark" ? "#64FFDA" : "#1976D2",
              },
            },
            "& .MuiOutlinedInput-input": {
              color: themeColor === "dark" ? "#CCCCCC" : "#333333",
            },
            "& .MuiInputLabel-outlined": {
              color: themeColor === "dark" ? "#CCCCCC" : "#333333",
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: themeColor === "dark" ? "#999999" : "#666666",
              opacity: 0.6,
            },
          }}
          margin="normal"
        />
        <Button
          onClick={check}
          variant="contained"
          color={themeColor === "dark" ? "info" : "primary"}
          size="large"
          style={{ marginTop: "16px" }}
          sx={{
            bgcolor: themeColor === "dark" ? "#2196F3" : "#1976D2",
            color: "#ffffff",
          }}>
          Search
        </Button>
        <Snackbar
          open={open}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert severity="info" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <Box>
          {clearable ? (
            <Button
              variant="contained"
              color={themeColor === "dark" ? "info" : "error"}
              size="large"
              onClick={cleanContent}
              sx={{
                bgcolor: themeColor === "dark" ? "#64FFDA" : "#D32F2F",
                color: "#333333",
                marginTop: "16px",
                width: "100%",
                maxWidth: "350px",
              }}>
              Clear the results
            </Button>
          ) : (
            ""
          )}
        </Box>
        {data.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "10px",
              width: "100%",
              textAlign: "left",
            }}>
            <Button
              onClick={sortAuthorsAscending}
              variant="contained"
              size="medium">
              Sort from A to Z
            </Button>
            <Button
              onClick={sortAuthorsDescending}
              variant="contained"
              size="medium">
              Sort from Z to A
            </Button>
            <Button
              onClick={sortAuthorsByWorkCountAscending}
              variant="contained"
              size="medium">
              Sort by most work count
            </Button>
            <Button
              onClick={sortAuthorsByWorkCountDescending}
              variant="contained"
              size="medium">
              Sort by least work count
            </Button>
          </Box>
        )}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "16px",
              width: "100%",
            }}>
            <CircularProgress />
          </Box>
        )}
        {showWaitMessage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              margin: "16px",
              padding: "16px",
              border: `1px solid ${
                themeColor === "dark" ? "#64FFDA" : "#1976D2"
              }`,
              color: themeColor === "dark" ? "#CCCCCC" : "#333333",
              borderRadius: "8px",
              backgroundColor: themeColor === "dark" ? "#333333" : "#f9f9f9",
            }}>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "8px",
              }}>
              Response is taking longer please be patient...
            </Typography>
            or:{" "}
            <Button
              onClick={cancelRequest}
              variant="contained"
              color="error"
              size="small">
              Cancel Request
            </Button>
          </Box>
        )}

        {respHeader && (
          <Grid container>
            <Typography
              variant="body1"
              className="text-white"
              sx={{ textAlign: "left", width: "100%" }}>
              {respHeader} Authors with similar names found!
            </Typography>
          </Grid>
        )}
        <Grid container spacing={2} justifyContent="center">
          {data.slice(0, visibleItems).map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link to={`/author/${item.key}`} className="no-underline">
                <Box
                  sx={{
                    border: `1px solid ${
                      themeColor === "dark" ? "#64FFDA" : "#1976D2"
                    }`,
                    padding: "16px",
                    borderRadius: "8px",
                    bgcolor: themeColor === "dark" ? "#1A2027" : "#FFFFFF",
                    color: themeColor === "dark" ? "#64FFDA" : "#1976D2",
                    textDecoration: "none",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor:
                        themeColor === "dark" ? "#333333" : "#f9f9f9",
                    },
                  }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body1">
                    Birth Date: {item.birth_date || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    Top Work: {item.top_work || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    Work Count:{" "}
                    <span
                      className={getClassByCount(
                        getValueCount(item.work_count)
                      )}>
                      {getValueCount(item.work_count)}
                    </span>
                  </Typography>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
        {data.length > visibleItems && (
          <Button
            onClick={loadMore}
            variant="contained"
            color={themeColor === "dark" ? "info" : "primary"}
            size="large"
            sx={{
              bgcolor: themeColor === "dark" ? "#2196F3" : "#1976D2",
              color: "#ffffff",
              marginTop: "16px",
            }}>
            Load More
          </Button>
        )}
      </Container>
    </>
  );
}

export default AuthorSearch;
