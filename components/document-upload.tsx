"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, CheckCircle, AlertCircle, X, Eye, RefreshCw, FileText, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentUploadProps {
  documentType: "government_id" | "proof_of_address" | "proof_of_income" | "bank_statement"
  title: string
  description: string
  acceptedTypes?: string[]
  maxSize?: number // in MB
  existingFile?: {
    name: string
    url: string
    uploadDate: string
    status: "pending" | "verified" | "rejected"
  }
  onUpload?: (file: File) => Promise<string | null>
  onDelete?: () => Promise<boolean>
  className?: string
}

export function DocumentUpload({
  documentType,
  title,
  description,
  acceptedTypes = ["image/*", ".pdf"],
  maxSize = 10,
  existingFile,
  onUpload,
  onDelete,
  className,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState(existingFile)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const fileType = file.type
    const fileName = file.name.toLowerCase()
    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileName.endsWith(type)
      }
      if (type.includes("*")) {
        const baseType = type.split("/")[0]
        return fileType.startsWith(baseType)
      }
      return fileType === type
    })

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(", ")}`
    }

    return null
  }

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const fileUrl = await onUpload?.(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (fileUrl) {
        setUploadedFile({
          name: file.name,
          url: fileUrl,
          uploadDate: new Date().toISOString(),
          status: "pending",
        })
      } else {
        throw new Error("Upload failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleDelete = async () => {
    if (onDelete) {
      const success = await onDelete()
      if (success) {
        setUploadedFile(undefined)
        setError(null)
      }
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <ImageIcon className="h-8 w-8 text-blue-600" />
    }
    if (extension === "pdf") {
      return <FileText className="h-8 w-8 text-red-600" />
    }
    return <File className="h-8 w-8 text-gray-600" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <RefreshCw className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
    }
  }

  return (
    <Card className={cn("shadow-lg border-0", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {uploadedFile && getStatusBadge(uploadedFile.status)}
        </div>
      </CardHeader>
      <CardContent>
        {uploadedFile ? (
          // Show uploaded file
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              {getFileIcon(uploadedFile.name)}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  Uploaded on {new Date(uploadedFile.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => window.open(uploadedFile.url, "_blank")}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>

            {uploadedFile.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Document Rejected</h4>
                    <p className="text-sm text-red-700 mt-1">
                      Please upload a clearer image or a different document that meets our requirements.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Show upload area
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                isUploading && "pointer-events-none opacity-50",
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <RefreshCw className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
                  <div className="space-y-2">
                    <p className="text-gray-600">Uploading document...</p>
                    <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                    <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      {acceptedTypes.join(", ")} up to {maxSize}MB
                    </p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Upload Error</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(",")}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
