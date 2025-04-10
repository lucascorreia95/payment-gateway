"use client"

import { useEffect, useState } from "react"
import { useApiKey } from "../../../../contexts/api-key-context"
import { getInvoices } from "@/lib/api"
import type { Invoice } from "../../../../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Plus } from "lucide-react"
import Link from "next/link"
import { format, parseISO } from "date-fns"

export default function DashboardPage() {
  const { apiKey } = useApiKey()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchInvoices() {
      if (!apiKey) return

      try {
        setIsLoading(true)
        const data = await getInvoices(apiKey)
        setInvoices(data)
      } catch (err) {
        setError("Falha ao carregar faturas")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [apiKey])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesSearch =
      searchQuery === "" ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

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
      return format(parseISO(dateString), "dd/MM/yyyy")
    } catch {
      return dateString
    }
  }

  return (
    <div className="container py-8">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Faturas</CardTitle>
            <CardDescription>Gerencie suas faturas e acompanhe os pagamentos</CardDescription>
          </div>
          <Link href="/invoice/new">
            <Button className="bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Nova Fatura
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Buscar</label>
              <Input
                placeholder="ID ou descrição"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Carregando faturas...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>DATA</TableHead>
                      <TableHead>DESCRIÇÃO</TableHead>
                      <TableHead>VALOR</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead>AÇÕES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Nenhuma fatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>#{invoice.id}</TableCell>
                          <TableCell>{formatDate(invoice.created_at)}</TableCell>
                          <TableCell>{invoice.description}</TableCell>
                          <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={`/invoice/${invoice.id}`}>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredInvoices.length} de {invoices.length} resultados
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    &lt;
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    &gt;
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
