import React from "react";

const FilterSidebar = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <aside className="filter-sidebar">
      <h3>Filter By</h3>
      <div>
        <label>Budget</label>
        <select name="budget" onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="200">$0 - $200</option>
          <option value="500">$200 - $500</option>
        </select>
      </div>
      <div>
        <label>Stops</label>
        <select name="stops" onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="nonstop">Nonstop</option>
          <option value="1">1 Stop</option>
        </select>
      </div>
    </aside>
  );
};

export default FilterSidebar;
