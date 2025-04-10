import { v4 as uuidv4 } from "uuid"
import type { Account, CreateInvoicePayload, Invoice } from "../../types"
import { MOCK_API_KEY, initializeData, saveData } from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getAccount(apiKey: string): Promise<Account> {
  if (apiKey == MOCK_API_KEY) {
    const { account } = initializeData()
    return account
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts`, {
    headers: {
      "X-API-KEY": apiKey
    }
  })

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();

  if (!json.api_key) {
    throw new Error("Invalid API Key")
  }

  return {
    api_key: json.api_key,
    balance: json.balance,
    created_at: json.created_at,
    email: json.email,
    id: json.id,
    name: json.name,
    updated_at: json.updated_at
  }
}

export async function getInvoices(apiKey: string): Promise<Invoice[]> {
  if (apiKey == MOCK_API_KEY) {
    await delay(800) // Simulate network delay

    const { invoices } = initializeData()
  
    if (apiKey !== MOCK_API_KEY) {
      throw new Error("Invalid API Key")
    }
  
    return invoices
  } else {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice`, {
      headers: {
        "X-API-KEY": apiKey
      }
    })
  
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  
    const json: Invoice[] = await response.json();
  
    return json
  }
}

export async function getInvoice(apiKey: string, id: string): Promise<Invoice> {
  if (apiKey === MOCK_API_KEY) {
    await delay(600) // Simulate network delay

    const { invoices } = initializeData()

    const invoice = invoices.find((inv: { id: string }) => inv.id === id)

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    return invoice
  } else {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/${id}`, {
      headers: {
        "X-API-KEY": apiKey
      }
    })
  
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  
    const json: Invoice = await response.json();
  
    return json
  }
}

export async function createInvoice(apiKey: string, data: CreateInvoicePayload): Promise<Invoice> {
  if (apiKey === MOCK_API_KEY) {
    await delay(1200) // Simulate network delay
    const { account, invoices } = initializeData()

    // Determine status based on amount (as per business rules)
    let status: "pending" | "approved" | "rejected" = "pending"

    if (data.amount <= 10000) {
      // 70% chance of approval for amounts <= 10000
      status = Math.random() < 0.7 ? "approved" : "rejected"
    }

    const now = new Date().toISOString()

    const newInvoice: Invoice = {
      id: "inv-" + uuidv4().substring(0, 8),
      account_id: account.id,
      amount: data.amount,
      status,
      description: data.description,
      payment_type: data.payment_type,
      card_last_digits: data.card_number.slice(-4),
      created_at: now,
      updated_at: now,
    }

    // Update account balance if approved
    if (status === "approved") {
      account.balance += data.amount
      account.updated_at = now
    }

    // Save the new invoice and updated account
    const updatedInvoices = [newInvoice, ...invoices]
    saveData(account, updatedInvoices)

    return newInvoice
  } else {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-API-KEY": apiKey
      },
      body: JSON.stringify({
        amount: data.amount,
        description: data.description,
        card_number: data.card_number,
        expiry_moth: data.expiry_month,
        expiry_year: data.expiry_year,
        payment_type: "credit_card",
        cvv: data.cvv,
        cardholderName: data.cardholder_name
      })
    })

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    const newInvoice: Invoice = {
      id: json.id,
      account_id: json.account_id,
      amount: json.amount,
      status: json.status,
      description: json.description,
      payment_type: json.payment_type,
      card_last_digits: json.card_last_digits,
      created_at: json.created_at,
      updated_at: json.updated_at,
    }
  
    return newInvoice
  }
}