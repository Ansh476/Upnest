import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="top-0 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] z-10 p-4">
      <input 
        type="text"     
        placeholder="Search courses..." 
        value={query} 
        onChange={handleInputChange} 
        className="w-full p-2 border-2 rounded text-white"
      />
    </div>
  );
};

export default SearchBar;
