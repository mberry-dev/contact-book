import { useState } from "react";
import { createContact, isDuplicateEmail, validateEmail } from "../utils/contacts";

/**
 * ContactForm Component - Handles adding new contacts
 * Features form validation, duplicate checking, and controlled inputs
 */
function ContactForm({ addContact, contacts }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles form submission with validation
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

     // Validation: Check required fields
    if (!name.trim() || !email.trim()) {
      setError("Name and Email are required!");
      setIsSubmitting(false);
      return;
    }

    // Validation: Check email format
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Validation: Check for duplicate email
    if (isDuplicateEmail(contacts, email)) {
      setError("A contact with this email already exists.");
      setIsSubmitting(false);
      return;
    }

    // Create new contact object with unique ID
    const newContact = createContact({ name, email, phone });

    // Add contact to parent state
    addContact(newContact);

    // Reset form fields
    setName("");
    setEmail("");
    setPhone("");
    setIsSubmitting(false);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Name Input - Required field */}
      <input
        type="text"
        placeholder="Name*"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Contact name"
        required
      />

       {/* Email Input - Required field with validation */}
      <input
        type="email"
        placeholder="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Contact email"
        required
      />

       {/* Phone Input - Optional field */}
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        aria-label="Contact phone number"
      />

      {/* Submit Button - Disabled during submission */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Contact"}
      </button>

      {/* Error Message Display */}
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default ContactForm;