import { Typography, Box, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useTheme from "../../hooks/useTheme";
import { memo } from "react";

const AuthorResultsHeader = memo(({ totalResults, sortConfig, onSort, secondaryQuery, setSecondaryQuery }) => {
  const [themeColor] = useTheme();

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, color: themeColor === "dark" ? "white" : "black" }}>
        {totalResults} Authors found!
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
        <Button onClick={() => onSort("name")} variant="outlined">
          Sort by Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
        </Button>
        <Button onClick={() => onSort("work_count")} variant="outlined">
          Sort by Works {sortConfig.key === "work_count" && (sortConfig.direction === "asc" ? "↑" : "↓")}
        </Button>
      </Box>

      <TextField
        label="Filter results"
        placeholder="Type to filter fetched authors..."
        variant="outlined"
        value={secondaryQuery}
        onChange={(e) => setSecondaryQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: themeColor === "dark" ? "white" : "black", mr: 1 }} />,
          sx: { borderRadius: "999px" },
        }}
        sx={{
          maxWidth: { xs: "100%", sm: 450 },
          width: "100%",
          mt: 2,
          "& .MuiInputBase-input": {
            color: themeColor === "dark" ? "white" : "black",
          },
          "& .MuiInputLabel-root": {
            color: themeColor === "dark" ? "white" : "black",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: themeColor === "dark" ? "rgba(0,200,200,0.7)" : "rgba(0,0,0,1)",
          },
        }}
      />
    </>
  );
});

export default AuthorResultsHeader;
