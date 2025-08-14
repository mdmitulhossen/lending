"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  User,
  LogOut,
  CreditCard,
  FileText,
  Calendar,
  Bell,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DashboardPage() {
  const [user] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    creditScore: 720,
    availableCredit: 5000,
    totalBorrowed: 2500,
    activeLoans: 1,
    completedLoans: 3,
  })

  const [loans] = useState([
    {
      id: "1",
      amount: 2500,
      purpose: "Vehicle Repair",
      status: "active",
      nextPayment: "2024-02-15",
      paymentAmount: 285,
      remainingBalance: 1850,
      interestRate: 12.5,
      term: 12,
    },
    {
      id: "2",
      amount: 1500,
      purpose: "Medical Emergency",
      status: "completed",
      completedDate: "2024-01-10",
      interestRate: 11.8,
      term: 6,
    },
    {
      id: "3",
      amount: 3000,
      purpose: "Home Improvement",
      status: "completed",
      completedDate: "2023-12-05",
      interestRate: 13.2,
      term: 18,
    },
  ])

  const [recentTransactions] = useState([
    {
      id: "1",
      type: "payment",
      amount: 285,
      description: "Monthly Payment - Vehicle Repair Loan",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      type: "disbursement",
      amount: 2500,
      description: "Loan Disbursement - Vehicle Repair",
      date: "2024-01-01",
      status: "completed",
    },
    {
      id: "3",
      type: "payment",
      amount: 285,
      description: "Monthly Payment - Vehicle Repair Loan",
      date: "2023-12-15",
      status: "completed",
    },
  ])

  const [upcomingPayments] = useState([
    {
      id: "1",
      loanId: "1",
      amount: 285,
      dueDate: "2024-02-15",
      loanPurpose: "Vehicle Repair",
      status: "upcoming",
    },
    {
      id: "2",
      loanId: "1",
      amount: 285,
      dueDate: "2024-03-15",
      loanPurpose: "Vehicle Repair",
      status: "scheduled",
    },
  ])

  const [notifications] = useState([
    {
      id: "1",
      type: "payment_due",
      message: "Payment of $285 due in 3 days",
      date: "2024-02-12",
      read: false,
    },
    {
      id: "2",
      type: "document_required",
      message: "Income verification document required",
      date: "2024-02-10",
      read: false,
    },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              QuickieCashie
            </Link>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </Button>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your loan activity and account status.</p>
        </div>

        {notifications.filter((n) => !n.read).length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-800">Action Required</h4>
                  <p className="text-sm text-orange-700">
                    You have {notifications.filter((n) => !n.read).length} pending notification(s) that need your
                    attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available Credit</p>
                  <p className="text-2xl font-bold text-green-600">${user.availableCredit.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Credit Score</p>
                  <p className="text-2xl font-bold text-blue-600">{user.creditScore}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Loans</p>
                  <p className="text-2xl font-bold text-orange-600">{user.activeLoans}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Borrowed</p>
                  <p className="text-2xl font-bold text-purple-600">${user.totalBorrowed.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Loans */}
            <Card className="shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Loans</CardTitle>
                  <CardDescription>Your current loan obligations</CardDescription>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/apply">
                    <Plus className="h-4 w-4 mr-2" />
                    New Loan
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loans
                  .filter((loan) => loan.status === "active")
                  .map((loan) => (
                    <div key={loan.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">${loan.amount.toLocaleString()}</h4>
                          <p className="text-sm text-gray-600">{loan.purpose}</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Active</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            ${(loan.amount - loan.remainingBalance).toLocaleString()} / ${loan.amount.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={((loan.amount - loan.remainingBalance) / loan.amount) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Next Payment</p>
                          <p className="font-medium">{new Date(loan.nextPayment).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Amount</p>
                          <p className="font-medium">${loan.paymentAmount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Remaining Balance</p>
                          <p className="font-medium">${loan.remainingBalance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Interest Rate</p>
                          <p className="font-medium">{loan.interestRate}% APR</p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Make Payment
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Statement
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest loan-related activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "payment" ? "bg-red-100" : "bg-green-100"
                          }`}
                        >
                          {transaction.type === "payment" ? (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "payment" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {transaction.type === "payment" ? "-" : "+"}${transaction.amount.toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Loan History */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Loan History</CardTitle>
                <CardDescription>Your completed loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loans
                    .filter((loan) => loan.status === "completed")
                    .map((loan) => (
                      <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">${loan.amount.toLocaleString()}</h4>
                            <p className="text-sm text-gray-600">{loan.purpose}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(loan.completedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Your scheduled loan payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">${payment.amount}</p>
                        <p className="text-xs text-gray-600">{payment.loanPurpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(payment.dueDate).toLocaleDateString()}</p>
                      <Badge variant="outline" className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Link href="/apply">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for New Loan
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/documents">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="text-sm font-medium text-green-600">95%</span>
                </div>
                <Progress value={95} className="h-2" />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Bank Account Linked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Income Verification Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is here to help you with any questions about your loans or account.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
