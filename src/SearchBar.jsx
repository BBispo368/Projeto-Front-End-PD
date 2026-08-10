import React, { useState, useEffect } from 'react';

function SearchBar({ searchTerm, onSearch }) {
    const [inputValue, setInputValue] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(inputValue);
        }, 250); // Debounce time
        return () => clearTimeout(handler);
    }, [inputValue, onSearch]);

    return <input id="search-input" className="search-input" type="search" placeholder="Buscar produtos..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />;
}
export default SearchBar;