export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  sms: string
  landlineNumber: string
  extId: string
  contactOwnerId: string | null
  contactTimezone: string | null
  jobTitle: string | null
  listIds: string[]
  companyId: string | null
  linkedin: string | null
  subscribed: string[]
  blocklisted: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContactInput {
  firstName: string
  lastName: string
  email: string
  sms: string
  landlineNumber: string
  extId: string
  contactOwnerId: string | null
  contactTimezone: string | null
  jobTitle: string | null
  listIds: string[]
  companyId: string | null
  linkedin: string | null
}
