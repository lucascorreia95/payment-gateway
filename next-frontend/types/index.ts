export interface Account {
  id: string
  name: string
  email: string
  api_key: string
  balance: number
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  account_id: string
  amount: number
  status: "pending" | "approved" | "rejected"
  description: string
  payment_type: string
  card_last_digits?: string
  created_at: string
  updated_at: string
}

export interface CreateInvoicePayload {
  amount: number
  description: string
  payment_type: string
  card_number: string
  cvv: string
  expiry_month: number
  expiry_year: number
  cardholder_name: string
}
