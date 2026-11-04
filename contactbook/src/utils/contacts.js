// Pure helper functions for the Contact Book, kept out of the components so they can be tested on their own.

export const STORAGE_KEY = "contactbook.contacts";

/**
 * Checks that an email looks like name@domain.tld
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Formats a 10-digit US phone number as (XXX) XXX-XXXX.
 * Anything else is returned as typed; an empty value becomes "Not provided".
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return "Not provided";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}

/**
 * Keeps contacts whose name or email contains the search text (case-insensitive).
 * @param {Array} contacts
 * @param {string} filter
 * @returns {Array}
 */
export function filterContacts(contacts, filter) {
  const text = filter.trim().toLowerCase();
  if (!text) return contacts;
  return contacts.filter(
    (c) => c.name.toLowerCase().includes(text) || c.email.toLowerCase().includes(text)
  );
}

/**
 * True if a contact with this email (ignoring case and surrounding spaces) is already in the list.
 * @param {Array} contacts
 * @param {string} email
 * @returns {boolean}
 */
export function isDuplicateEmail(contacts, email) {
  const wanted = email.trim().toLowerCase();
  return contacts.some((c) => c.email.trim().toLowerCase() === wanted);
}

/**
 * Creates a contact with a unique id. Trims every field.
 * @param {{name: string, email: string, phone?: string}} fields
 * @returns {{id: string, name: string, email: string, phone: string}}
 */
export function createContact({ name, email, phone = "" }) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, name: name.trim(), email: email.trim(), phone: phone.trim() };
}

/**
 * Reads saved contacts from the browser. Returns [] if nothing is saved,
 * storage is unavailable, or the saved data is damaged.
 * @param {Storage} [storage]
 * @returns {Array}
 */
export function loadContacts(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c) => c && typeof c.id === "string" && typeof c.name === "string" && typeof c.email === "string"
    ).map((c) => ({ ...c, phone: typeof c.phone === "string" ? c.phone : "" }));
  } catch {
    return [];
  }
}

/**
 * Saves contacts to the browser. Fails quietly (e.g. private mode, full storage).
 * @param {Array} contacts
 * @param {Storage} [storage]
 * @returns {boolean} true if saved
 */
export function saveContacts(contacts, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    return true;
  } catch {
    return false;
  }
}
