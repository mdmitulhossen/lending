"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Signup Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join thousands of satisfied customers and get your loan approved in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    address: "",

    // Employment Information
    employerName: "",
    jobTitle: "",
    employmentType: "",
    monthlyIncome: "",
    payFrequency: "",

    // Banking Information
    bankName: "",
    accountNumber: "",
    routingNumber: "",

    // Security
    password: "",
    confirmPassword: "",

    // Consents
    agreeTerms: false,
    agreeCredit: false,
    agreeMarketing: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsLoading(true)
      setError("")

      try {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          setIsLoading(false)
          return
        }

        // Create customer in Frappe
        const customerData = {
          customer_name: formData.fullName,
          customer_type: "Individual",
          customer_group: "Individual",
          territory: "All Territories",
          email_id: formData.email,
          mobile_no: formData.phone,
          address_line1: formData.address,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          nationality: formData.nationality,
          employer_name: formData.employerName,
          job_title: formData.jobTitle,
          employment_type: formData.employmentType,
          monthly_income: Number.parseFloat(formData.monthlyIncome),
          pay_frequency: formData.payFrequency,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          routing_number: formData.routingNumber,
          marketing_consent: formData.agreeMarketing,
          credit_check_consent: formData.agreeCredit,
          terms_accepted: formData.agreeTerms,
        }


        // const result = await customerService.createCustomer(customerData)
        const res = await fetch("/api/frappe-create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // If login required: 'Authorization': `token ${accessKey}:${secretKey}`
          },
          body: JSON.stringify(customerData),
        });

        const result = await res.json(); // <-- Parse JSON here

        if (res.ok && result.success) {
          // Store user data and redirect to dashboard
          localStorage.setItem("user", JSON.stringify(result.data))
          router.push("/dashboard?welcome=true")
        } else {
          setError(result.error || "Registration failed. Please try again.")
        }

      } catch (err) {
        setError("An error occurred during registration. Please try again.")
        console.error("Registration error:", err)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
            >
              {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
            </div>
            {step < 3 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <PersonalInformationStep
            formData={formData}
            updateFormData={updateFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isLoading={isLoading}
          />
        )}

        {currentStep === 2 && (
          <EmploymentInformationStep formData={formData} updateFormData={updateFormData} isLoading={isLoading} />
        )}

        {currentStep === 3 && (
          <BankingAndConsentsStep formData={formData} updateFormData={updateFormData} isLoading={isLoading} />
        )}

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-8"
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-cyan-500 transition-colors px-8 ml-auto"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : currentStep === 3 ? "Create Account" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  )
}

function PersonalInformationStep({
  formData,
  updateFormData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
}: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Legal Name *</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={(value) => updateFormData("gender", value)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality *</Label>
          <Input
            id="nationality"
            placeholder="Enter your nationality"
            value={formData.nationality}
            onChange={(e) => updateFormData("nationality", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Home Address *</Label>
        <Input
          id="address"
          placeholder="Enter your complete address"
          value={formData.address}
          onChange={(e) => updateFormData("address", e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmploymentInformationStep({ formData, updateFormData, isLoading }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employerName">Employer/Business Name *</Label>
          <Input
            id="employerName"
            placeholder="Enter employer or business name"
            value={formData.employerName}
            onChange={(e) => updateFormData("employerName", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title/Occupation *</Label>
          <Input
            id="jobTitle"
            placeholder="Enter your job title"
            value={formData.jobTitle}
            onChange={(e) => updateFormData("jobTitle", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment Type *</Label>
          <Select onValueChange={(value) => updateFormData("employmentType", value)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
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
          <Label htmlFor="monthlyIncome">Monthly Income *</Label>
          <Input
            id="monthlyIncome"
            type="number"
            placeholder="Enter monthly income"
            value={formData.monthlyIncome}
            onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payFrequency">Pay Frequency *</Label>
          <Select onValueChange={(value) => updateFormData("payFrequency", value)} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select pay frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="irregular">Irregular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

function BankingAndConsentsStep({ formData, updateFormData, isLoading }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Banking Information</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              placeholder="Enter your bank name"
              value={formData.bankName}
              onChange={(e) => updateFormData("bankName", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) => updateFormData("accountNumber", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="routingNumber">Routing Number *</Label>
            <Input
              id="routingNumber"
              placeholder="Enter routing number"
              value={formData.routingNumber}
              onChange={(e) => updateFormData("routingNumber", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Legal Consents</h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => updateFormData("agreeTerms", checked)}
              required
              disabled={isLoading}
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
              id="agreeCredit"
              checked={formData.agreeCredit}
              onCheckedChange={(checked) => updateFormData("agreeCredit", checked)}
              required
              disabled={isLoading}
            />
            <Label htmlFor="agreeCredit" className="text-sm leading-relaxed">
              I consent to credit checks and data verification for loan processing and compliance purposes. *
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeMarketing"
              checked={formData.agreeMarketing}
              onCheckedChange={(checked) => updateFormData("agreeMarketing", checked)}
              disabled={isLoading}
            />
            <Label htmlFor="agreeMarketing" className="text-sm leading-relaxed">
              I would like to receive marketing communications about QuickieCashie products and services.
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
