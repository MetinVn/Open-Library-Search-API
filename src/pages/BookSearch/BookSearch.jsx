import { useState } from "react";
import { Alert, Snackbar, Container, Typography, Box, CircularProgress } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ThemeSwitcher from "../../layouts/ThemeSwitcher";
import useTheme from "../../hooks/useTheme";
import BookSearchForm from "../../layouts/BookPageLayout/BookSearchForm";
import BookResultsHeader from "../../layouts/BookPageLayout/BookResultsHeader";
import BookList from "../../layouts/BookPageLayout/BookList";
import { useBookSearch } from "../../hooks/useBookSearch";
import { useBookSortAndFilter } from "../../hooks/useBookSortAndFilter";

const ITEMS_PER_PAGE = 12;

function BookSearch() {
  const [themeColor, setThemeColor] = useTheme();
  const isMobile = window.innerWidth < 600;

  const { query, setQuery, books, loading, error, setError, searchBooks, handleClear, showWaitMessage, controllerRef } =
    useBookSearch();

  const { filteredBooks, secondaryQuery, setSecondaryQuery, sortConfig, handleSort } = useBookSortAndFilter(books);

  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => setVisibleItems((prev) => prev + ITEMS_PER_PAGE);

  const handleSearchClick = () => searchBooks(query);

  return (
    <>
      <Sidebar colors={themeColor} />
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          minHeight: "100vh",
          padding: "90px 20px",
          bgcolor: themeColor === "dark" ? "#1F2937" : "#bee3db",
          transition: "background-color 0.3s",
        }}
      >
        <ThemeSwitcher setThemeColor={setThemeColor} themeColor={themeColor} />
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mt: { xs: 6, sm: 8 },
            color: themeColor === "dark" ? "#64FFDA" : "#1976D2",
          }}
        >
          Search for Books
        </Typography>
        <BookSearchForm
          query={query}
          setQuery={setQuery}
          onSearch={handleSearchClick}
          onClear={handleClear}
          isLoading={loading}
          isClearable={books && books.length > 0}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: isMobile ? "right" : "center" }}
        >
          <Alert severity="info">{error}</Alert>
        </Snackbar>
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
            <CircularProgress color="inherit" />
            {showWaitMessage && (
              <Box sx={{ border: 1, p: 2, textAlign: "center" }}>
                <Typography>Response is taking longer than usual...</Typography>
                <Button onClick={() => controllerRef.current?.abort()} color="error">
                  Cancel Request
                </Button>
              </Box>
            )}
          </Box>
        )}
        {books?.length > 0 && (
          <>
            <BookResultsHeader
              totalResults={books.length}
              sortConfig={sortConfig}
              onSort={handleSort}
              secondaryQuery={secondaryQuery}
              setSecondaryQuery={setSecondaryQuery}
            />
            <BookList
              books={filteredBooks.slice(0, visibleItems)}
              onLoadMore={handleLoadMore}
              hasMore={filteredBooks.length > visibleItems}
              themeColor={themeColor}
            />
          </>
        )}
        {books?.length === 0 && !loading && (
          <Typography variant="body1" sx={{ mt: 4, color: themeColor === "dark" ? "white" : "black" }}>
            No books found. Please try a different query.
          </Typography>
        )}
      </Container>
    </>
  );
}

export default BookSearch;
