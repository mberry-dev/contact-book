import { describe, expect, test, vi } from 'vitest'
import {
  STORAGE_KEY, createContact, filterContacts, formatPhone,
  isDuplicateEmail, loadContacts, saveContacts, validateEmail,
} from '../src/utils/contacts'

const sample = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', phone: '' },
  { id: '2', name: 'Grace Hopper', email: 'grace@navy.mil', phone: '5551234567' },
]

describe('validateEmail', () => {
  test.each(['a@b.co', 'first.last@sub.example.org'])('accepts %s', (e) => expect(validateEmail(e)).toBe(true))
  test.each(['', 'plain', 'a@b', '@b.com', 'a b@c.com', 'a@b .com'])('rejects "%s"', (e) => expect(validateEmail(e)).toBe(false))
})

describe('formatPhone', () => {
  test('formats 10 digits', () => expect(formatPhone('5551234567')).toBe('(555) 123-4567'))
  test('formats 10 digits typed with punctuation', () => expect(formatPhone('555-123-4567')).toBe('(555) 123-4567'))
  test('leaves other lengths as typed', () => expect(formatPhone('+44 20 7946 0958')).toBe('+44 20 7946 0958'))
  test('empty becomes "Not provided"', () => {
    expect(formatPhone('')).toBe('Not provided')
    expect(formatPhone(undefined)).toBe('Not provided')
  })
})

describe('filterContacts', () => {
  test('empty or blank search returns everyone', () => {
    expect(filterContacts(sample, '')).toEqual(sample)
    expect(filterContacts(sample, '   ')).toEqual(sample)
  })
  test('matches name, case-insensitive', () => expect(filterContacts(sample, 'GRACE')).toEqual([sample[1]]))
  test('matches email', () => expect(filterContacts(sample, 'navy.mil')).toEqual([sample[1]]))
  test('no match returns an empty list', () => expect(filterContacts(sample, 'zzz')).toEqual([]))
})

describe('isDuplicateEmail', () => {
  test('ignores case and spaces', () => expect(isDuplicateEmail(sample, '  ADA@Example.com ')).toBe(true))
  test('new email is not a duplicate', () => expect(isDuplicateEmail(sample, 'new@example.com')).toBe(false))
})

describe('createContact', () => {
  test('trims fields and gives each contact a different id', () => {
    const a = createContact({ name: ' A ', email: ' a@b.co ', phone: ' 1 ' })
    const b = createContact({ name: 'A', email: 'a@b.co' })
    expect(a).toMatchObject({ name: 'A', email: 'a@b.co', phone: '1' })
    expect(b.phone).toBe('')
    expect(a.id).not.toBe(b.id)
  })
})

describe('saving and loading', () => {
  test('round trip', () => {
    expect(saveContacts(sample)).toBe(true)
    expect(loadContacts()).toEqual(sample)
  })
  test('nothing saved gives an empty list', () => expect(loadContacts()).toEqual([]))
  test('damaged data gives an empty list', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadContacts()).toEqual([])
    localStorage.setItem(STORAGE_KEY, '{"a":1}')
    expect(loadContacts()).toEqual([])
  })
  test('drops malformed entries and fills in a missing phone', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([null, { id: 1 }, { id: 'x', name: 'N', email: 'n@n.co' }]))
    expect(loadContacts()).toEqual([{ id: 'x', name: 'N', email: 'n@n.co', phone: '' }])
  })
  test('storage that throws does not crash', () => {
    const broken = { getItem: vi.fn(() => { throw new Error('blocked') }), setItem: vi.fn(() => { throw new Error('full') }) }
    expect(loadContacts(broken)).toEqual([])
    expect(saveContacts(sample, broken)).toBe(false)
  })
})
