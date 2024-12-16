import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState({
    origin: "",
    destination: "",
    date: "",
  });

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        name="origin"
        placeholder="Origin Airport"
        value={search.origin}
        onChange={handleChange}
      />
      <input
        type="text"
        name="destination"
        placeholder="Destination Airport"
        value={search.destination}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        value={search.date}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
