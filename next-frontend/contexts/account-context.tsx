"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { Account } from "../types"

interface AccountContextType {
  account: Account | null
  setAccount: (account: Account) => void
  clearAccount: () => void
  isLoading: boolean
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccountState] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Load Account from localStorage on mount
    const storedAccountString = localStorage.getItem("account")
    const storedAccount: Account = storedAccountString ? JSON.parse(storedAccountString) : null
    if (storedAccount) {
      setAccount(storedAccount)
    }
    setIsLoading(false)
  }, [])

  const setAccount = (account: Account) => {
    const accountString = JSON.stringify(account)
    localStorage.setItem("account", accountString)
    setAccountState(account)
  }

  const clearAccount = () => {
    localStorage.removeItem("account")
    setAccountState(null)
  }

  return <AccountContext.Provider value={{ account, setAccount, clearAccount, isLoading }}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}
