"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApiKey } from "../../../../../contexts/api-key-context"
import { createInvoice } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default function CreateInvoicePage() {
  const { apiKey } = useApiKey()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    card_number: "",
    cvv: "",
    expiry_month: "",
    expiry_year: "",
    cardholder_name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateTotal = () => {
    const amount = Number.parseFloat(formData.amount) || 0
    const fee = amount * 0.02 // 2% fee
    return {
      subtotal: amount,
      fee,
      total: amount + fee,
    }
  }

  const { subtotal, fee, total } = calculateTotal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey) return

    setIsLoading(true)
    setError("")

    try {
      const payload = {
        amount: Number.parseFloat(formData.amount),
        description: formData.description,
        payment_type: "credit_card",
        card_number: formData.card_number,
        cvv: formData.cvv,
        expiry_month: Number.parseInt(formData.expiry_month),
        expiry_year: Number.parseInt(formData.expiry_year),
        cardholder_name: formData.cardholder_name,
      }

      const invoice = await createInvoice(apiKey, payload)
      router.push(`/invoice/${invoice.id}`)
    } catch (err) {
      setError("Falha ao processar o pagamento. Verifique os dados e tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Criar Nova Fatura</CardTitle>
          <p className="text-muted-foreground">Preencha os dados abaixo para processar um novo pagamento</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">Valor</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="pl-10 bg-secondary"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Descrição</label>
                  <Textarea
                    name="description"
                    placeholder="Descreva o motivo do pagamento"
                    className="min-h-[120px] bg-secondary"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Dados do Cartão</h3>

                <div>
                  <label className="text-sm font-medium mb-1 block">Número do Cartão</label>
                  <Input
                    name="card_number"
                    placeholder="0000 0000 0000 0000"
                    className="bg-secondary"
                    value={formData.card_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Mês de Expiração</label>
                    <Input
                      name="expiry_month"
                      placeholder="MM"
                      className="bg-secondary"
                      value={formData.expiry_month}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Ano de Expiração</label>
                    <Input
                      name="expiry_year"
                      placeholder="AA"
                      className="bg-secondary"
                      value={formData.expiry_year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">CVV</label>
                    <Input
                      name="cvv"
                      placeholder="123"
                      className="bg-secondary"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Nome no Cartão</label>
                  <Input
                    name="cardholder_name"
                    placeholder="Como aparece no cartão"
                    className="bg-secondary"
                    value={formData.cardholder_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Processamento (2%)</span>
                  <span>R$ {fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" disabled={isLoading}>
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-primary">
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? "Processando..." : "Processar Pagamento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
