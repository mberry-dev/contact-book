/**
 * SearchBar Component - Provides search/filter functionality
 * Controlled component that filters contacts by name or email
 */
function SearchBar({ filter, setFilter }) {
  return (
    <div className="search-bar">
       {/* Search Input - Controlled by parent state */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Search contacts"
      />
    </div>
  );
}

export default SearchBar;
