import ContactItem from "./ContactItem";

/**
 * ContactList Component - Displays the list of contacts
 * Handles empty states and filtered results
 */

function ContactList({ contacts, deleteContact, filter }) {
  // Show appropriate message when no contacts are available
  if (contacts.length === 0) {
    return (
      <p>
        {filter
          ? `No matches found for "${filter}".`
          : "No contacts yet. Add one above!"}
      </p>
    );
  }

  return (
    <div className="contact-list">
      {/* Map through filtered contacts and render each ContactItem */}
      {contacts.map((c) => (
        <ContactItem 
        key={c.id} // Unique key for React rendering optimization
        contact={c} 
        deleteContact={deleteContact} 
        />
      ))}
    </div>
  );
}

export default ContactList;
