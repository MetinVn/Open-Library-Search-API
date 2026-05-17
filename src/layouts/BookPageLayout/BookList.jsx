import { Grid, Button } from "@mui/material";
import BookCard from "../../layouts/BookPageLayout/BookCard";
import { memo } from "react";

const BookList = memo(({ books, onLoadMore, hasMore, themeColor }) => (
  <>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {books.map((item) => (
        <BookCard key={item.key} item={item} themeColor={themeColor} />
      ))}
    </Grid>
    {hasMore && (
      <Button onClick={onLoadMore} sx={{ mt: 2 }} variant="contained">
        Load More
      </Button>
    )}
  </>
));

export default BookList;
