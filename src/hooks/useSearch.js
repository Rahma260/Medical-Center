import { useState, useMemo } from "react";

export const useSearch = (data, searchFields = []) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase().trim();

    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    filteredData,
    handleSearchChange,
    clearSearch,
  };
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};