import { useState, useRef, useEffect, useCallback } from "react";
import useIndexDB, { BOOK_STORE, DB_NAME, IMAGE_STORE } from "./useIndexDB";
import useDebounce from "./useDebounce";
import { fetchWithSignal } from "../utils/fetchWithSignal";

const CACHE_KEY_BOOKS = "cachedBooks";
const CACHE_KEY_QUERY = "cachedBookQuery";
const DEBOUNCE_DELAY = 800;

export function useBookSearch() {
  const { storeData, retrieveData, clearStore } = useIndexDB(DB_NAME);
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const controllerRef = useRef(null);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  const getStoredQuery = async () => await retrieveData(BOOK_STORE, CACHE_KEY_QUERY);

  const searchBooks = useCallback(async (searchQuery) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (loading || !normalizedQuery) {
      setError(!normalizedQuery ? "This field can't be empty" : null);
      return;
    }
    const storedQuery = await getStoredQuery();
    if (storedQuery === normalizedQuery) {
      setError("Same query already executed, skipping...");
      return;
    }
    setLoading(true);
    setBooks(null);
    setError(null);
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`;
      const response = await fetchWithSignal(url, controllerRef, setShowWaitMessage);
      if (response.docs.length > 0) {
        setBooks(response.docs);
        await clearStore(BOOK_STORE);
        await storeData(BOOK_STORE, CACHE_KEY_BOOKS, response);
        await storeData(BOOK_STORE, CACHE_KEY_QUERY, normalizedQuery);
      } else {
        setBooks([]);
        await clearStore(BOOK_STORE);
      }
    } catch (err) {
      if (err.name !== "AbortError") setError("Failed to fetch data. Please try again.");
    } finally {
      setShowWaitMessage(false);
      setLoading(false);
      controllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery) searchBooks(debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
    const loadCache = async () => {
      setLoading(true);
      const savedResult = await retrieveData(BOOK_STORE, CACHE_KEY_BOOKS);
      const savedQuery = await retrieveData(BOOK_STORE, CACHE_KEY_QUERY);
      if (savedResult && savedQuery) {
        setBooks(savedResult.docs);
        setQuery(savedQuery);
      }
      setLoading(false);
    };
    loadCache();
  }, []);

  const handleClear = async () => {
    setQuery("");
    setBooks(null);
    await clearStore(BOOK_STORE);
    await clearStore(IMAGE_STORE);
  };

  return {
    query,
    setQuery,
    books,
    loading,
    error,
    setError,
    searchBooks,
    handleClear,
    showWaitMessage,
    controllerRef,
  };
}
