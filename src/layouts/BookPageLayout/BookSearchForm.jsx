import { TextField, Button, Box } from "@mui/material";
import { memo } from "react";
import useTheme from "../../hooks/useTheme";

const BookSearchForm = memo(({ query, setQuery, onSearch, onClear, isLoading, isClearable }) => {
  const [themeColor] = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        width: "100%",
        maxWidth: { xs: "100%", sm: 350 },
      }}
    >
      <TextField
        label="Search for books here"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          maxWidth: { xs: "100%", sm: 350 },
          width: "100%",
          "& .MuiInputBase-input": { color: themeColor === "dark" ? "white" : "black" },
          "& .MuiInputLabel-root": { color: themeColor === "dark" ? "white" : "black" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: themeColor === "dark" ? "rgba(0,200,200,0.7)" : "rgba(0,0,0,1)",
          },
        }}
      />
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", width: "100%", maxWidth: 350 }}>
        <Button onClick={onSearch} variant="contained" color="primary" size="large" disabled={isLoading}>
          Search
        </Button>
        {isClearable && (
          <Button onClick={onClear} variant="text" color="error" size="large">
            Clear Results
          </Button>
        )}
      </Box>
    </Box>
  );
});

export default BookSearchForm;
