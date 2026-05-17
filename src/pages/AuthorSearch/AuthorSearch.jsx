import { useState } from "react";
import { Alert, Snackbar, Container, Typography, Box, CircularProgress } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ThemeSwitcher from "../../layouts/ThemeSwitcher";
import useTheme from "../../hooks/useTheme";
import AuthorSearchForm from "../../layouts/AuthorPageLayout/AuthorSearchForm";
import AuthorResultsHeader from "../../layouts/AuthorPageLayout/AuthorResultsHeader";
import AuthorList from "../../layouts/AuthorPageLayout/AuthorList";
import { useAuthorSearch } from "../../hooks/useAuthorSearch";
import { useSortAndFilter } from "../../hooks/useSortAndFilter";

const ITEMS_PER_PAGE = 12;

function AuthorSearch() {
  const [themeColor, setThemeColor] = useTheme();
  const isMobile = window.innerWidth < 600;

  const {
    query,
    setQuery,
    authors,
    loading,
    error,
    setError,
    totalResults,
    searchAuthors,
    handleClear,
    showWaitMessage,
    controllerRef,
  } = useAuthorSearch();

  const { filteredData, secondaryQuery, setSecondaryQuery, sortConfig, handleSort } = useSortAndFilter(authors);

  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleSearchClick = () => {
    searchAuthors(query);
  };

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
            color: themeColor === "dark" ? "white" : "black",
          }}
        >
          Search for Authors
        </Typography>

        <AuthorSearchForm
          query={query}
          setQuery={setQuery}
          onSearch={handleSearchClick}
          onClear={handleClear}
          isLoading={loading}
          isClearable={authors && authors.length > 0}
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

        {authors?.length > 0 && (
          <>
            <AuthorResultsHeader
              totalResults={totalResults}
              sortConfig={sortConfig}
              onSort={handleSort}
              secondaryQuery={secondaryQuery}
              setSecondaryQuery={setSecondaryQuery}
            />
            <AuthorList
              authors={filteredData.slice(0, visibleItems)}
              onLoadMore={handleLoadMore}
              hasMore={filteredData.length > visibleItems}
            />
          </>
        )}

        {authors?.length === 0 && !loading && (
          <Typography variant="body1" sx={{ mt: 4, color: themeColor === "dark" ? "white" : "black" }}>
            No authors found. Please try a different name.
          </Typography>
        )}
      </Container>
    </>
  );
}

export default AuthorSearch;
