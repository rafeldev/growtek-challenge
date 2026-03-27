import type { Contact } from '../types/contact'

export const MOCK_CONTACT_OWNERS = [
  { id: 'owner-1', label: 'Rafael Alvarez Cardona' },
  { id: 'owner-2', label: 'Jane Doe' },
]

export const MOCK_TIMEZONES = [
  { id: 'america/bogota', label: 'America/Bogota (GMT-5)' },
  { id: 'america/new_york', label: 'America/New York (GMT-5)' },
  { id: 'europe/madrid', label: 'Europe/Madrid (GMT+1)' },
]

const today = new Date().toISOString().slice(0, 10)

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    firstName: 'Rafael',
    lastName: 'Alvarez',
    email: 'rafewui@gmail.com',
    sms: '+57 300 0000000',
    landlineNumber: '',
    extId: '',
    contactOwnerId: 'owner-1',
    contactTimezone: 'america/bogota',
    jobTitle: '',
    listIds: [],
    companyId: null,
    linkedin: '',
    subscribed: ['email'],
    blocklisted: false,
    createdAt: today,
    updatedAt: today,
  },
]
