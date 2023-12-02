import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
 if (!context) {
  console.error ("Search context not found");
    return {searchQuery: '', setSearchQuery: () => {}};
  }
  return context;
};
