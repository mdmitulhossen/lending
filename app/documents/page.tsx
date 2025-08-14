/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { DocumentUpload } from "@/components/document-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LoanApplicationService } from "@/lib/frappe-services"
import { ArrowLeft, CheckCircle, FileText, Info, LogOut, Shield, Upload, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DocumentStatus {
  government_id: "pending" | "verified" | "rejected" | null
  proof_of_address: "pending" | "verified" | "rejected" | null
  proof_of_income: "pending" | "verified" | "rejected" | null
  bank_statement: "pending" | "verified" | "rejected" | null
}

export default function DocumentsPage() {
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
    government_id: null,
    proof_of_address: null,
    proof_of_income: null,
    bank_statement: null,
  })

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Mock application ID - in real app, this would come from route params or context
  const applicationId = "LOAN-APP-001"

  useEffect(() => {
    // Load existing documents
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      // In real implementation, fetch from Frappe API
      // const application = await LoanApplicationService.getApplication(applicationId)
      // setUploadedFiles(application?.documents || {})
      // setDocumentStatus(application?.documentStatus || {})

      // Mock data for demo
      setUploadedFiles({
        government_id: {
          name: "drivers_license.jpg",
          url: "/placeholder.svg",
          uploadDate: "2024-01-15T10:30:00Z",
          status: "verified",
        },
      })
      setDocumentStatus({
        government_id: "verified",
        proof_of_address: null,
        proof_of_income: "pending",
        bank_statement: null,
      })
    } catch (error) {
      console.error("Failed to load documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (documentType: string, file: File): Promise<string | null> => {
    try {
      // Upload to Frappe API
      const fileUrl = await LoanApplicationService.uploadDocument(applicationId, file, documentType as any)

      if (fileUrl) {
        // Update local state
        setUploadedFiles((prev) => ({
          ...prev,
          [documentType]: {
            name: file.name,
            url: fileUrl,
            uploadDate: new Date().toISOString(),
            status: "pending",
          },
        }))

        setDocumentStatus((prev) => ({
          ...prev,
          [documentType]: "pending",
        }))
      }

      return fileUrl
    } catch (error) {
      console.error("Upload failed:", error)
      return null
    }
  }

  const handleDelete = async (documentType: string): Promise<boolean> => {
    try {
      // In real implementation, delete from Frappe API
      // await LoanApplicationService.deleteDocument(applicationId, documentType)

      // Update local state
      setUploadedFiles((prev) => {
        const updated = { ...prev }
        delete updated[documentType]
        return updated
      })

      setDocumentStatus((prev) => ({
        ...prev,
        [documentType]: null,
      }))

      return true
    } catch (error) {
      console.error("Delete failed:", error)
      return false
    }
  }

  const getOverallProgress = () => {
    const statuses = Object.values(documentStatus)
    const uploaded = statuses.filter((status) => status !== null).length
    const verified = statuses.filter((status) => status === "verified").length
    return {
      uploaded: (uploaded / 4) * 100,
      verified: (verified / 4) * 100,
    }
  }

  const progress = getOverallProgress()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Upload</h1>
          <p className="text-gray-600 mt-2">Upload the required documents to complete your loan application.</p>
        </div>

        {/* Progress Overview */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Upload Progress
            </CardTitle>
            <CardDescription>Track your document upload and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Documents Uploaded</span>
                  <span className="font-medium">{Math.round(progress.uploaded)}% Complete</span>
                </div>
                <Progress value={progress.uploaded} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Documents Verified</span>
                  <span className="font-medium">{Math.round(progress.verified)}% Complete</span>
                </div>
                <Progress value={progress.verified} className="h-2 bg-green-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(documentStatus).filter((s) => s !== null).length}
                </div>
                <div className="text-sm text-gray-600">Uploaded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {Object.values(documentStatus).filter((s) => s === "pending").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(documentStatus).filter((s) => s === "verified").length}
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(documentStatus).filter((s) => s === "rejected").length}
                </div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          <DocumentUpload
            documentType="government_id"
            title="Government-Issued ID"
            description="Upload a clear photo of your driver's license, passport, or national ID card"
            acceptedTypes={["image/*", ".pdf"]}
            maxSize={10}
            existingFile={uploadedFiles.government_id}
            onUpload={(file) => handleUpload("government_id", file)}
            onDelete={() => handleDelete("government_id")}
          />

          <DocumentUpload
            documentType="proof_of_address"
            title="Proof of Address"
            description="Upload a utility bill, bank statement, or lease agreement from the last 3 months"
            acceptedTypes={["image/*", ".pdf"]}
            maxSize={10}
            existingFile={uploadedFiles.proof_of_address}
            onUpload={(file) => handleUpload("proof_of_address", file)}
            onDelete={() => handleDelete("proof_of_address")}
          />

          <DocumentUpload
            documentType="proof_of_income"
            title="Proof of Income"
            description="Upload your latest pay stub, employment letter, or tax return"
            acceptedTypes={["image/*", ".pdf"]}
            maxSize={10}
            existingFile={uploadedFiles.proof_of_income}
            onUpload={(file) => handleUpload("proof_of_income", file)}
            onDelete={() => handleDelete("proof_of_income")}
          />

          <DocumentUpload
            documentType="bank_statement"
            title="Bank Statement"
            description="Upload your bank statement from the last 3 months"
            acceptedTypes={["image/*", ".pdf"]}
            maxSize={10}
            existingFile={uploadedFiles.bank_statement}
            onUpload={(file) => handleUpload("bank_statement", file)}
            onDelete={() => handleDelete("bank_statement")}
          />
        </div>

        {/* Important Information */}
        <Card className="shadow-lg border-0 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-6 w-6 mr-2 text-blue-600" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Document Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Documents must be clear and readable</li>
                  <li>• All four corners must be visible</li>
                  <li>• No blurry or dark images</li>
                  <li>• File size must be under 10MB</li>
                  <li>• Accepted formats: JPG, PNG, PDF</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Processing Time</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Document review: 1-2 business days</li>
                  <li>• Verification results via email</li>
                  <li>• Rejected documents can be re-uploaded</li>
                  <li>• Support available for questions</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Your Documents Are Secure</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    All uploaded documents are encrypted and stored securely. We only use them for loan processing and
                    verification purposes. Your privacy is our priority.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/apply">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Application
            </Link>
          </Button>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={loadDocuments} className="bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>

            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">
                Continue to Dashboard
                <CheckCircle className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
