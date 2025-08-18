"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react"

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data since no payments exist yet
  const mockPayments = [
    {
      id: 1,
      user: { name: "John Doe", email: "john@example.com" },
      course: { title: "React Fundamentals", price: 99.99 },
      amount: 99.99,
      status: "completed",
      payment_method: "credit_card",
      created_at: "2025-08-17T10:30:00Z",
    },
    {
      id: 2,
      user: { name: "Jane Smith", email: "jane@example.com" },
      course: { title: "Advanced JavaScript", price: 149.99 },
      amount: 149.99,
      status: "pending",
      payment_method: "paypal",
      created_at: "2025-08-17T09:15:00Z",
    },
  ]

  const stats = {
    total_revenue: 0,
    total_payments: 0,
    successful_payments: 0,
    pending_payments: 0,
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10B981"
      case "pending":
        return "#F5BB07"
      case "failed":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Payments Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold" style={{ color: "#313D6A" }}>
                  ${stats.total_revenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8" style={{ color: "#313D6A" }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold" style={{ color: "#F5BB07" }}>
                  {stats.total_payments}
                </p>
              </div>
              <CreditCard className="h-8 w-8" style={{ color: "#F5BB07" }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successful_payments}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending_payments}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* No Payments State */}
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center">
            <CreditCard className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h3>
            <p className="text-gray-500 mb-4">
              Payment transactions will appear here once users start purchasing courses.
            </p>
            <div className="text-sm text-gray-400">
              <p>• Payment processing integration needed</p>
              <p>• Stripe/PayPal gateway setup required</p>
              <p>• Course pricing and checkout flow</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Payments Table (Hidden for now) */}
      <Card className="hidden">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-mono text-sm">#{payment.id}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.user.name}</p>
                        <p className="text-sm text-gray-600">{payment.user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{payment.course.title}</p>
                    </td>
                    <td className="py-4 px-4 font-medium">${payment.amount}</td>
                    <td className="py-4 px-4">
                      <Badge
                        style={{
                          backgroundColor: getStatusColor(payment.status),
                          color: "white",
                        }}
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600 capitalize">{payment.payment_method.replace("_", " ")}</td>
                    <td className="py-4 px-4 text-gray-600">{new Date(payment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
