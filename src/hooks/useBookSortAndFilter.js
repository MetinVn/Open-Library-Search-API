import { useState, useMemo } from "react";

export function useBookSortAndFilter(books) {
  const [secondaryQuery, setSecondaryQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" });

  const handleSort = () => {
    setSortConfig((current) => ({
      key: "title",
      direction: current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedBooks = useMemo(() => {
    if (!books) return [];
    const isAsc = sortConfig.direction === "asc";
    return [...books].sort((a, b) => {
      const aVal = (a.title || "").toLowerCase();
      const bVal = (b.title || "").toLowerCase();
      return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [books, sortConfig]);

  const filteredBooks = useMemo(() => {
    if (!secondaryQuery.trim()) return sortedBooks;
    const q = secondaryQuery.toLowerCase();
    return sortedBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(q) || book.author_name?.some((author) => author.toLowerCase().includes(q))
    );
  }, [sortedBooks, secondaryQuery]);

  return {
    filteredBooks,
    secondaryQuery,
    setSecondaryQuery,
    sortConfig,
    handleSort,
  };
}
