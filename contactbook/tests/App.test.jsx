import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { STORAGE_KEY } from '../src/utils/contacts'

async function addContact(user, name, email, phone = '') {
  await user.type(screen.getByLabelText('Contact name'), name)
  await user.type(screen.getByLabelText('Contact email'), email)
  if (phone) await user.type(screen.getByLabelText('Contact phone number'), phone)
  await user.click(screen.getByRole('button', { name: 'Add Contact' }))
}

describe('Contact Book app', () => {
  test('starts empty', () => {
    render(<App />)
    expect(screen.getByText('No contacts yet. Add one above!')).toBeInTheDocument()
  })

  test('adds a contact, formats the phone and clears the form', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addContact(user, 'Ada Lovelace', 'ada@example.com', '5551234567')
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument()
    expect(screen.getByLabelText('Contact name')).toHaveValue('')
  })

  test('rejects a duplicate email', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addContact(user, 'Ada', 'ada@example.com')
    await addContact(user, 'Ada Two', 'ADA@example.com')
    expect(screen.getByText('A contact with this email already exists.')).toBeInTheDocument()
    expect(screen.queryByText('Ada Two')).not.toBeInTheDocument()
  })

  test('rejects an invalid email', async () => {
    const user = userEvent.setup()
    render(<App />)
    // type="email" lets the browser block some bad values, so bypass it like a script would
    await user.type(screen.getByLabelText('Contact name'), 'Bob')
    await user.type(screen.getByLabelText('Contact email'), 'bob@x')
    const form = screen.getByRole('button', { name: 'Add Contact' }).closest('form')
    form.noValidate = true
    await user.click(screen.getByRole('button', { name: 'Add Contact' }))
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
  })

  test('searches by name and email and shows a no-match message', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addContact(user, 'Ada', 'ada@example.com')
    await addContact(user, 'Grace', 'grace@navy.mil')
    await user.type(screen.getByLabelText('Search contacts'), 'navy')
    expect(screen.queryByText('Ada')).not.toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Search contacts'))
    await user.type(screen.getByLabelText('Search contacts'), 'zzz')
    expect(screen.getByText('No matches found for "zzz".')).toBeInTheDocument()
  })

  test('deletes only the chosen contact', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addContact(user, 'Ada', 'ada@example.com')
    await addContact(user, 'Grace', 'grace@navy.mil')
    await user.click(screen.getByRole('button', { name: 'Delete contact Ada' }))
    expect(screen.queryByText('Ada')).not.toBeInTheDocument()
    expect(screen.getByText('Grace')).toBeInTheDocument()
  })

  test('contacts survive a reload (saved in the browser)', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await addContact(user, 'Ada', 'ada@example.com')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(1)
    first.unmount()
    render(<App />)
    expect(screen.getByText('Ada')).toBeInTheDocument()
  })

  test('deleting updates what is saved', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addContact(user, 'Ada', 'ada@example.com')
    await user.click(screen.getByRole('button', { name: 'Delete contact Ada' }))
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([])
  })
})
