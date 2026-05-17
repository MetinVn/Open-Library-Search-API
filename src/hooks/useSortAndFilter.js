import { useState, useMemo } from "react";
import { getValueCount } from "../functions/CalcCounts";

export const useSortAndFilter = (data) => {
  const [secondaryQuery, setSecondaryQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "work_count", direction: "desc" });

  const handleSort = (key) => {
    setSortConfig((currentConfig) => {
      const direction = currentConfig.key === key && currentConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    const sorted = [...data].sort((a, b) => {
      const { key, direction } = sortConfig;
      const isAsc = direction === "asc";
      let aVal, bVal;
      if (key === "name") {
        aVal = (a.name || "").toLowerCase();
        bVal = (b.name || "").toLowerCase();
        return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (key === "work_count") {
        aVal = getValueCount(a.work_count) || 0;
        bVal = getValueCount(b.work_count) || 0;
        return isAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!secondaryQuery.trim()) return sortedData;
    const q = secondaryQuery.toLowerCase();
    return sortedData.filter(
      (item) => item.name?.toLowerCase().includes(q) || item.top_work?.toLowerCase().includes(q)
    );
  }, [sortedData, secondaryQuery]);

  return {
    filteredData,
    secondaryQuery,
    setSecondaryQuery,
    sortConfig,
    handleSort,
  };
};
