import { formatPhone } from "../utils/contacts";

/**
 * ContactItem Component - Displays individual contact information
 * Shows contact details and provides delete functionality
 */
function ContactItem({ contact, deleteContact }) {
  
  return (
    <div className="contact-item">
      <div className="contact-info">
        <p><strong>{contact.name}</strong></p>
        <p>{contact.email}</p>
        <p>{formatPhone(contact.phone)}</p>
      </div>

      {/* Delete Button with accessibility label */}
      <button 
        onClick={() => deleteContact(contact.id)}
        aria-label={`Delete contact ${contact.name}`}
      >
        Delete
      </button>
    </div>
  );
}

export default ContactItem;
