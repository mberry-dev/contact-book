import { useState } from "react";
import ContactForm from "./components/ContactForm";
import SearchBar from "./components/SearchBar";
import ContactList from "./components/ContactList";
import "./index.css";

/**
 * Main App Component - Root component that manages global state
 * Handles contacts array, filter state, and coordinates all child components
 */
function App() {
   // State for storing all contacts
  const [contacts, setContacts] = useState([]);
  // State for search filter text
  const [filter, setFilter] = useState("");

  /**
   * Adds a new contact to the contacts array
   * @param {Object} contact - The contact object to add
   */
  const addContact = (contact) => {
    setContacts([...contacts, contact]);
  };

  /**
   * Deletes a contact by ID
   * @param {string} id - The ID of the contact to delete
   */
  const deleteContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  /**
   * Filters contacts based on search text
   * Matches against name or email (case-insensitive)
   */
  const filteredContacts = contacts.filter(
    (c) => 
      c.name.toLowerCase().includes(filter.toLowerCase()) || 
      c.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>📒 Contact Book</h1>
      {/* Contact Form Component */}
      <ContactForm addContact={addContact} contacts={contacts} />
       {/* Search Bar Component */}
      <SearchBar filter={filter} setFilter={setFilter} />
      {/* Contact List Component - shows filtered results */}
      <ContactList contacts={filteredContacts} deleteContact={deleteContact} filter={filter} />
    </div>
  );
}

export default App;