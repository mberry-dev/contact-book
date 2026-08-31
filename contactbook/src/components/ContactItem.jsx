/**
 * ContactItem Component - Displays individual contact information
 * Shows contact details and provides delete functionality
 */
function ContactItem({ contact, deleteContact }) {
  
  /**
   * Formats phone number for better display
   * @param {string} phone - Raw phone number string
   * @returns {string} - Formatted phone number or "Not provided"
   */
  const formatPhone = (phone) => {
    if (!phone) return "Not provided";
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format US phone numbers: (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    // Return original if not standard US format
    return phone;
  };

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
