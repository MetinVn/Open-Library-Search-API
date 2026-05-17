import { Grid, Button } from "@mui/material";
import AuthorCard from "./AuthorCard";
import { memo } from "react";

const AuthorList = memo(({ authors, onLoadMore, hasMore }) => {
  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {authors.map((author) => (
          <Grid item xs={12} sm={6} md={4} key={author.key}>
            <AuthorCard author={author} />
          </Grid>
        ))}
      </Grid>
      {hasMore && (
        <Button onClick={onLoadMore} sx={{ mt: 2 }} variant="contained">
          Load More
        </Button>
      )}
    </>
  );
});

export default AuthorList;
