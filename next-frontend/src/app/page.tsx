"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApiKey } from "../../contexts/api-key-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { getAccount } from "@/lib/api"
import { ApiKeyProvider } from "../../contexts/api-key-context"
import { MOCK_API_KEY } from "@/lib/mock-data"
import { AccountProvider, useAccount } from "../../contexts/account-context"

function AuthPage() {
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { setApiKey } = useApiKey()
  const { setAccount } = useAccount()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKeyInput.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const account = await getAccount(apiKeyInput)
      setAccount(account)
      setApiKey(apiKeyInput)
      router.push("/dashboard")
    } catch {
      setError("API Key inválida. Por favor, verifique e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const useMockApiKey = () => {
    setApiKeyInput(MOCK_API_KEY)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Autenticação Gateway</CardTitle>
          <CardDescription>Insira sua API Key para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                API Key
              </label>
              <div className="flex space-x-2">
                <Input
                  id="apiKey"
                  type="text"
                  placeholder="Digite sua API Key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="bg-secondary"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "→"}
                </Button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Alert className="bg-secondary border-primary/20">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Como obter uma API Key?</AlertTitle>
              <AlertDescription>
                Para obter sua API Key, você precisa criar uma conta de comerciante. Entre em contato com nosso suporte
                para mais informações.
              </AlertDescription>
            </Alert>

            <div className="pt-2">
              <Button type="button" variant="outline" className="w-full" onClick={useMockApiKey}>
                Usar API Key de Teste
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">API Key de teste: {MOCK_API_KEY}</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthPageWithProvider() {
  return (
    <ApiKeyProvider>
      <AccountProvider>
        <AuthPage />
      </AccountProvider>
    </ApiKeyProvider>
  )
}
