import type { Account, Invoice } from "../../types"
import { v4 as uuidv4 } from "uuid"

// Mock API Key for testing
const MOCK_API_KEY = "test-api-key-12345"

// Mock Account
const mockAccount: Account = {
  id: "acc-" + uuidv4().substring(0, 8),
  name: "Empresa Teste",
  email: "empresa@teste.com",
  api_key: MOCK_API_KEY,
  balance: 15000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Mock Invoices
const generateMockInvoices = (): Invoice[] => {
  const now = new Date()

  return [
    {
      id: "inv-" + uuidv4().substring(0, 8),
      account_id: mockAccount.id,
      amount: 1500,
      status: "approved",
      description: "Compra Online #123",
      payment_type: "credit_card",
      card_last_digits: "1234",
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
    },
    {
      id: "inv-" + uuidv4().substring(0, 8),
      account_id: mockAccount.id,
      amount: 15000,
      status: "pending",
      description: "Serviço Premium",
      payment_type: "credit_card",
      card_last_digits: "5678",
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 47).toISOString(), // 47 hours ago
    },
    {
      id: "inv-" + uuidv4().substring(0, 8),
      account_id: mockAccount.id,
      amount: 99.9,
      status: "rejected",
      description: "Assinatura Mensal",
      payment_type: "credit_card",
      card_last_digits: "9012",
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 71).toISOString(), // 71 hours ago
    },
    {
      id: "inv-" + uuidv4().substring(0, 8),
      account_id: mockAccount.id,
      amount: 250.5,
      status: "approved",
      description: "Produto Digital",
      payment_type: "credit_card",
      card_last_digits: "3456",
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 95).toISOString(), // 95 hours ago
    },
    {
      id: "inv-" + uuidv4().substring(0, 8),
      account_id: mockAccount.id,
      amount: 12000,
      status: "pending",
      description: "Consultoria Empresarial",
      payment_type: "credit_card",
      card_last_digits: "7890",
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
      updated_at: new Date(now.getTime() - 1000 * 60 * 60 * 119).toISOString(), // 119 hours ago
    },
  ]
}

// Initialize or load data from localStorage
const initializeData = () => {
  if (typeof window === "undefined") throw Error("Fatal Error")

  let storedAccount = localStorage.getItem("mockAccount")
  let storedInvoices = localStorage.getItem("mockInvoices")

  if (!storedAccount) {
    localStorage.setItem("mockAccount", JSON.stringify(mockAccount))
    storedAccount = JSON.stringify(mockAccount)
  }

  if (!storedInvoices) {
    const invoices = generateMockInvoices()
    localStorage.setItem("mockInvoices", JSON.stringify(invoices))
    storedInvoices = JSON.stringify(invoices)
  }

  return {
    account: JSON.parse(storedAccount),
    invoices: JSON.parse(storedInvoices),
  }
}

// Save data to localStorage
const saveData = (account: Account, invoices: Invoice[]) => {
  if (typeof window === "undefined") return

  localStorage.setItem("mockAccount", JSON.stringify(account))
  localStorage.setItem("mockInvoices", JSON.stringify(invoices))
}

export { MOCK_API_KEY, initializeData, saveData }
