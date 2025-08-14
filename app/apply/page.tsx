/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  DollarSign,
  FileText,
  Info,
  LogOut,
  Shield,
  Upload,
  User,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoanApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const [applicationData, setApplicationData] = useState({
    // Loan Details
    loanAmount: "",
    loanTerm: "",
    loanPurpose: "",
    purposeDescription: "",

    // Personal Information (pre-filled from profile)
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    address: "123 Main St, New York, NY 10001",

    // Employment Information (pre-filled from profile)
    employerName: "Tech Corp Inc.",
    jobTitle: "Software Engineer",
    employmentType: "full-time",
    monthlyIncome: "5000",
    workDuration: "2",

    // Banking Information (pre-filled from profile)
    bankName: "Chase Bank",
    accountType: "checking",
    accountNumber: "",
    routingNumber: "",

    // Documents
    uploadedDocuments: {
      governmentId: null,
      proofOfAddress: null,
      proofOfIncome: null,
      bankStatement: null,
    },

    // Consents
    agreeTerms: false,
    agreeCreditCheck: false,
    agreeDataUsage: false,
    agreeMarketing: false,
  })

  const updateApplicationData = (field: string, value: any) => {
    setApplicationData({ ...applicationData, [field]: value })
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitApplication = () => {
    // TODO: Implement application submission
    console.log("Submitting application:", applicationData)
  }

  const stepTitles = [
    "Loan Details",
    "Personal Information",
    "Employment & Income",
    "Banking Information",
    "Review & Submit",
  ]

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
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Loan Application</h1>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <p className="text-sm text-gray-600">{stepTitles[currentStep - 1]}</p>
          </div>
        </div>

        {/* Application Form */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <LoanDetailsStep applicationData={applicationData} updateApplicationData={updateApplicationData} />
            )}

            {currentStep === 2 && (
              <PersonalInformationStep
                applicationData={applicationData}
                updateApplicationData={updateApplicationData}
              />
            )}

            {currentStep === 3 && (
              <EmploymentIncomeStep applicationData={applicationData} updateApplicationData={updateApplicationData} />
            )}

            {currentStep === 4 && (
              <BankingInformationStep applicationData={applicationData} updateApplicationData={updateApplicationData} />
            )}

            {currentStep === 5 && (
              <ReviewSubmitStep
                applicationData={applicationData}
                updateApplicationData={updateApplicationData}
                onSubmit={submitApplication}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 mt-8 border-t">
              <Button onClick={prevStep} variant="outline" disabled={currentStep === 1} className="px-6 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="px-6 bg-blue-600 hover:bg-blue-700">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={submitApplication} className="px-6 bg-green-600 hover:bg-green-700">
                  Submit Application
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoanDetailsStep({ applicationData, updateApplicationData }: any) {
  const loanPurposes = [
    "Vehicle Repair",
    "Medical Emergency",
    "Home Improvement",
    "Debt Consolidation",
    "Business Expense",
    "Education",
    "Travel",
    "Other",
  ]

  const calculateMonthlyPayment = (amount: number, term: number, rate = 12.5) => {
    const monthlyRate = rate / 100 / 12
    const numPayments = term
    const payment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    return payment
  }

  const loanAmount = Number.parseFloat(applicationData.loanAmount) || 0
  const loanTerm = Number.parseInt(applicationData.loanTerm) || 12
  const monthlyPayment = loanAmount > 0 ? calculateMonthlyPayment(loanAmount, loanTerm) : 0

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <DollarSign className="h-12 w-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Loan Details</h2>
        <p className="text-gray-600">Tell us about the loan you need</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="loanAmount"
              type="number"
              placeholder="5,000"
              value={applicationData.loanAmount}
              onChange={(e) => updateApplicationData("loanAmount", e.target.value)}
              className="pl-8 h-12"
              min="500"
              max="50000"
              required
            />
          </div>
          <p className="text-xs text-gray-500">Minimum $500, Maximum $50,000</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanTerm">Loan Term *</Label>
          <Select value={applicationData.loanTerm} onValueChange={(value) => updateApplicationData("loanTerm", value)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select loan term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="18">18 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
              <SelectItem value="36">36 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanPurpose">Purpose of Loan *</Label>
          <Select
            value={applicationData.loanPurpose}
            onValueChange={(value) => updateApplicationData("loanPurpose", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              {loanPurposes.map((purpose) => (
                <SelectItem key={purpose} value={purpose.toLowerCase().replace(" ", "-")}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purposeDescription">Additional Details</Label>
          <Textarea
            id="purposeDescription"
            placeholder="Provide more details about your loan purpose (optional)"
            value={applicationData.purposeDescription}
            onChange={(e) => updateApplicationData("purposeDescription", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Loan Summary */}
      {loanAmount > 0 && applicationData.loanTerm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Loan Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Loan Amount</p>
                <p className="font-bold text-blue-900 text-lg">${loanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-700">Monthly Payment</p>
                <p className="font-bold text-blue-900 text-lg">${monthlyPayment.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-blue-700">Total Interest</p>
                <p className="font-bold text-blue-900 text-lg">
                  ${(monthlyPayment * loanTerm - loanAmount).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-700">
                This is an estimate based on a 12.5% APR. Your actual rate may vary based on your credit profile.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PersonalInformationStep({ applicationData, updateApplicationData }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <User className="h-12 w-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600">Verify your personal details</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Information Pre-filled</h4>
            <p className="text-sm text-green-700 mt-1">
              We&#39;ve pre-filled this information from your profile. Please review and update if necessary.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Legal Name *</Label>
          <Input
            id="fullName"
            value={applicationData.fullName}
            onChange={(e) => updateApplicationData("fullName", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={applicationData.email}
            onChange={(e) => updateApplicationData("email", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={applicationData.phone}
            onChange={(e) => updateApplicationData("phone", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={applicationData.dateOfBirth}
            onChange={(e) => updateApplicationData("dateOfBirth", e.target.value)}
            className="h-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Home Address *</Label>
        <Input
          id="address"
          value={applicationData.address}
          onChange={(e) => updateApplicationData("address", e.target.value)}
          className="h-12"
          placeholder="Enter your complete address"
          required
        />
      </div>
    </div>
  )
}

function EmploymentIncomeStep({ applicationData, updateApplicationData }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <FileText className="h-12 w-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Employment & Income</h2>
        <p className="text-gray-600">Tell us about your employment and income</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Information Pre-filled</h4>
            <p className="text-sm text-green-700 mt-1">
              We&#39;ve pre-filled this information from your profile. Please review and update if necessary.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employerName">Employer Name *</Label>
          <Input
            id="employerName"
            value={applicationData.employerName}
            onChange={(e) => updateApplicationData("employerName", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            value={applicationData.jobTitle}
            onChange={(e) => updateApplicationData("jobTitle", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type *</Label>
          <Select
            value={applicationData.employmentType}
            onValueChange={(value) => updateApplicationData("employmentType", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="gig">Gig Worker</SelectItem>
              <SelectItem value="self-employed">Self-employed</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workDuration">Time at Current Job *</Label>
          <Select
            value={applicationData.workDuration}
            onValueChange={(value) => updateApplicationData("workDuration", value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-6">Less than 6 months</SelectItem>
              <SelectItem value="6-12">6-12 months</SelectItem>
              <SelectItem value="1-2">1-2 years</SelectItem>
              <SelectItem value="2-5">2-5 years</SelectItem>
              <SelectItem value="5+">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              id="monthlyIncome"
              type="number"
              value={applicationData.monthlyIncome}
              onChange={(e) => updateApplicationData("monthlyIncome", e.target.value)}
              className="pl-8 h-12"
              placeholder="5,000"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Income Verification</h4>
            <p className="text-sm text-blue-700 mt-1">
              You&#39;ll need to upload proof of income documents in the next steps to verify this information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BankingInformationStep({ applicationData, updateApplicationData }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Shield className="h-12 w-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Banking Information</h2>
        <p className="text-gray-600">Secure banking details for loan disbursement</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name *</Label>
          <Input
            id="bankName"
            value={applicationData.bankName}
            onChange={(e) => updateApplicationData("bankName", e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type *</Label>
          <RadioGroup
            value={applicationData.accountType}
            onValueChange={(value) => updateApplicationData("accountType", value)}
            className="flex space-x-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="checking" id="checking" />
              <Label htmlFor="checking">Checking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="savings" id="savings" />
              <Label htmlFor="savings">Savings</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number *</Label>
          <Input
            id="accountNumber"
            value={applicationData.accountNumber}
            onChange={(e) => updateApplicationData("accountNumber", e.target.value)}
            className="h-12"
            placeholder="Enter your account number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="routingNumber">Routing Number *</Label>
          <Input
            id="routingNumber"
            value={applicationData.routingNumber}
            onChange={(e) => updateApplicationData("routingNumber", e.target.value)}
            className="h-12"
            placeholder="Enter your routing number"
            required
          />
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Your Information is Secure</h4>
            <p className="text-sm text-green-700 mt-1">
              We use bank-level encryption to protect your financial information. Your data is never stored in plain
              text and is only used for loan processing and disbursement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewSubmitStep({ applicationData, updateApplicationData, onSubmit }: any) {
  const loanAmount = Number.parseFloat(applicationData.loanAmount) || 0
  const loanTerm = Number.parseInt(applicationData.loanTerm) || 12
  const monthlyPayment = loanAmount > 0 ? (loanAmount * 0.125) / 12 + loanAmount / loanTerm : 0

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-gray-600">Review your application before submitting</p>
      </div>

      {/* Application Summary */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Application Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Loan Amount</p>
              <p className="font-semibold">${loanAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Loan Term</p>
              <p className="font-semibold">{loanTerm} months</p>
            </div>
            <div>
              <p className="text-gray-600">Purpose</p>
              <p className="font-semibold capitalize">{applicationData.loanPurpose?.replace("-", " ")}</p>
            </div>
            <div>
              <p className="text-gray-600">Monthly Payment</p>
              <p className="font-semibold">${monthlyPayment.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Monthly Income</p>
              <p className="font-semibold">${Number.parseInt(applicationData.monthlyIncome).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Bank</p>
              <p className="font-semibold">{applicationData.bankName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            Document Upload Required
          </CardTitle>
          <CardDescription>
            You&#39;ll be redirected to upload required documents after submitting this application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Government ID</p>
                <p className="text-sm text-gray-600">Driver&#39;s license or passport</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Proof of Address</p>
                <p className="text-sm text-gray-600">Utility bill or bank statement</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Proof of Income</p>
                <p className="text-sm text-gray-600">Pay stub or employment letter</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Bank Statement</p>
                <p className="text-sm text-gray-600">Last 3 months</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legal Agreements</CardTitle>
          <CardDescription>Please review and accept the following terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeTerms"
                checked={applicationData.agreeTerms}
                onCheckedChange={(checked) => updateApplicationData("agreeTerms", checked)}
                required
              />
              <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                . *
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeCreditCheck"
                checked={applicationData.agreeCreditCheck}
                onCheckedChange={(checked) => updateApplicationData("agreeCreditCheck", checked)}
                required
              />
              <Label htmlFor="agreeCreditCheck" className="text-sm leading-relaxed">
                I authorize QuickieCashie to perform credit checks and verify my information for loan processing. *
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeDataUsage"
                checked={applicationData.agreeDataUsage}
                onCheckedChange={(checked) => updateApplicationData("agreeDataUsage", checked)}
                required
              />
              <Label htmlFor="agreeDataUsage" className="text-sm leading-relaxed">
                I consent to the use of my data for loan underwriting and account management purposes. *
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeMarketing"
                checked={applicationData.agreeMarketing}
                onCheckedChange={(checked) => updateApplicationData("agreeMarketing", checked)}
              />
              <Label htmlFor="agreeMarketing" className="text-sm leading-relaxed">
                I would like to receive marketing communications about QuickieCashie products and services.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Before You Submit</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Please ensure all information is accurate. Submitting false information may result in loan denial and
              could affect your credit score.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
