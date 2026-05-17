import { useState, useEffect, useCallback, useRef } from "react";
import useIndexDB, { AUTHOR_STORE, DB_NAME } from "./useIndexDB";
import useDebounce from "./useDebounce";
import { fetchWithSignal } from "../utils/fetchWithSignal";

const CACHE_KEY_AUTHORS = "cachedAuthors";
const CACHE_KEY_QUERY = "cachedAuthorQuery";
const DEBOUNCE_DELAY = 800;

export const useAuthorSearch = () => {
  const { storeData, retrieveData, deleteData } = useIndexDB(DB_NAME);
  const [query, setQuery] = useState("");
  const [authors, setAuthors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(null);
  const [showWaitMessage, setShowWaitMessage] = useState(false);

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const signalControllerRef = useRef(null);

  const searchAuthors = useCallback(async (searchQuery) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (loading) return;
    if (!normalizedQuery) {
      setError("This field can't be empty");
      return;
    }

    const storedQuery = await retrieveData(AUTHOR_STORE, CACHE_KEY_QUERY);
    if (storedQuery === normalizedQuery) {
      setError("Same query already executed, skipping...");
      return;
    }

    console.log(`Searching authors for query: ${normalizedQuery}`);

    setLoading(true);
    setAuthors(null);
    setTotalResults(null);
    setError(null);

    try {
      const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(searchQuery)}`;
      const response = await fetchWithSignal(url, signalControllerRef, setShowWaitMessage);

      if (response.docs.length > 0) {
        setAuthors(response.docs);
        setTotalResults(response.numFound);
        await storeData(AUTHOR_STORE, CACHE_KEY_AUTHORS, response);
        await storeData(AUTHOR_STORE, CACHE_KEY_QUERY, normalizedQuery);
      } else {
        setAuthors([]);
        setTotalResults(0);
        await deleteData(AUTHOR_STORE, CACHE_KEY_AUTHORS);
        await deleteData(AUTHOR_STORE, CACHE_KEY_QUERY);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Fetch error:", err);
        setError("Failed to fetch data. Please try again.");
      }
    } finally {
      setShowWaitMessage(false);
      setLoading(false);
      signalControllerRef.current = null;
    }
  }, []);

  const handleClear = useCallback(async () => {
    setQuery("");
    setAuthors(null);
    setTotalResults(null);
    await deleteData(AUTHOR_STORE, CACHE_KEY_AUTHORS);
    await deleteData(AUTHOR_STORE, CACHE_KEY_QUERY);
  }, [deleteData]);

  useEffect(() => {
    const performSearch = async () => {
      const savedQuery = await retrieveData(AUTHOR_STORE, CACHE_KEY_QUERY);
      if (debouncedQuery && debouncedQuery !== savedQuery) {
        searchAuthors(debouncedQuery);
      }
    };
    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const loadCache = async () => {
      setLoading(true);
      const savedResult = await retrieveData(AUTHOR_STORE, CACHE_KEY_AUTHORS);
      const savedQuery = await retrieveData(AUTHOR_STORE, CACHE_KEY_QUERY);
      if (savedResult && savedQuery) {
        setAuthors(savedResult.docs);
        setTotalResults(savedResult.numFound);
        setQuery(savedQuery);
      }
      setLoading(false);
    };
    loadCache();
  }, []);

  return {
    query,
    setQuery,
    authors,
    loading,
    error,
    totalResults,
    searchAuthors,
    handleClear,
    showWaitMessage,
    signalControllerRef,
  };
};
