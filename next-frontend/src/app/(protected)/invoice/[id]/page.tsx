"use client"

import { useEffect, useState } from "react"
import { useApiKey } from "../../../../../contexts/api-key-context"
import { getInvoice } from "@/lib/api"
import type { Invoice } from "../../../../../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, CheckCircle } from "lucide-react"
import Link from "next/link"
import { format, parseISO } from "date-fns"

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const { apiKey } = useApiKey()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchInvoice() {
      if (!apiKey) return

      try {
        setIsLoading(true)
        const data = await getInvoice(apiKey, params.id)
        setInvoice(data)
      } catch (err) {
        setError("Falha ao carregar detalhes da fatura")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoice()
  }, [apiKey, params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Aprovado</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pendente</Badge>
      case "rejected":
        return <Badge className="bg-red-600">Rejeitado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm")
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-8">Carregando detalhes da fatura...</div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="container py-8">
        <div className="text-center py-8 text-red-500">{error || "Fatura não encontrada"}</div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              Fatura #{invoice.id} {getStatusBadge(invoice.status)}
            </h1>
            <p className="text-sm text-muted-foreground">Criada em {formatDate(invoice.created_at)}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Informações da Fatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID da Fatura</p>
                <p className="font-medium">#{invoice.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="font-medium">R$ {invoice.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Criação</p>
                <p className="font-medium">{formatDate(invoice.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="font-medium">{formatDate(invoice.updated_at)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="font-medium">{invoice.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Status da Transação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 rounded-full p-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Fatura Criada</p>
                  <p className="text-sm text-muted-foreground">{formatDate(invoice.created_at)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`${invoice.status !== "rejected" ? "bg-green-600" : "bg-red-600"} rounded-full p-1`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Pagamento Processado</p>
                  <p className="text-sm text-muted-foreground">{formatDate(invoice.updated_at)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className={`${invoice.status === "approved" ? "bg-green-600" : invoice.status === "rejected" ? "bg-red-600" : "bg-yellow-600"} rounded-full p-1`}
                >
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    Transação{" "}
                    {invoice.status === "approved"
                      ? "Aprovada"
                      : invoice.status === "rejected"
                        ? "Rejeitada"
                        : "Pendente"}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(invoice.updated_at)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">Cartão de Crédito</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Últimos Dígitos</p>
                <p className="font-medium">**** **** **** {invoice.card_last_digits || "1234"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Titular</p>
                <p className="font-medium">João da Silva</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Dados Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID da Conta</p>
                <p className="font-medium">{invoice.account_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IP do Cliente</p>
                <p className="font-medium">192.168.1.1</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dispositivo</p>
                <p className="font-medium">Desktop - Chrome</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
