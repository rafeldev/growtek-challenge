export interface ContactList {
  id: string
  name: string
  contactIds: string[]
  createdAt: string
}

export interface CreateContactListInput {
  name: string
  contactIds: string[]
}
