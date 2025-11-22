import { useState } from "react";

export function useSearchQuery() {
  const [query, setQuery] = useState<string>("");

  const onSearch = (value: string) => {
    setQuery(value);
  };

  return {
    query,
    onSearch,
  };
}