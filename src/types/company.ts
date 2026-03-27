export interface Company {
  id: string
  name: string
  domain: string
  industry: string
  phone: string
  contactId: string | null
  dealId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyInput {
  name: string
  domain: string
  industry: string
  phone: string
  contactId: string | null
  dealId: string | null
}
