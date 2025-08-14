"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Briefcase,
  CreditCard,
  Shield,
  Bell,
  LogOut,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ProfilePage() {
  const [user] = useState({
    id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    gender: "male",
    nationality: "American",
    address: "123 Main St, New York, NY 10001",
    employerName: "Tech Corp Inc.",
    jobTitle: "Software Engineer",
    employmentType: "full-time",
    monthlyIncome: "5000",
    payFrequency: "monthly",
    bankName: "Chase Bank",
    accountNumber: "****1234",
    routingNumber: "****5678",
    profileImage: "",
    verificationStatus: "verified",
    accountStatus: "active",
    memberSince: "2024-01-15",
  })

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ProfileTabs user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSidebar({ user }: { user: any }) {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Profile Image */}
          <div className="relative">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.fullName} />
              <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                {user.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Status Badges */}
          <div className="space-y-2">
            <Badge
              variant={user.verificationStatus === "verified" ? "default" : "secondary"}
              className={
                user.verificationStatus === "verified"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }
            >
              {user.verificationStatus === "verified" ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {user.verificationStatus === "verified" ? "Verified" : "Pending Verification"}
            </Badge>

            <Badge
              variant={user.accountStatus === "active" ? "default" : "secondary"}
              className="bg-blue-100 text-blue-800 hover:bg-blue-100"
            >
              Account {user.accountStatus}
            </Badge>
          </div>

          <Separator />

          <div className="text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Member since:</span>
              <span className="font-medium">
                {new Date(user.memberSince).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profile completion:</span>
              <span className="font-medium text-green-600">95%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileTabs({ user }: { user: any }) {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 bg-white border">
        <TabsTrigger value="personal" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Personal</span>
        </TabsTrigger>
        <TabsTrigger value="employment" className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4" />
          <span className="hidden sm:inline">Employment</span>
        </TabsTrigger>
        <TabsTrigger value="banking" className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Banking</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <PersonalInformationTab user={user} />
      </TabsContent>

      <TabsContent value="employment">
        <EmploymentInformationTab user={user} />
      </TabsContent>

      <TabsContent value="banking">
        <BankingInformationTab user={user} />
      </TabsContent>

      <TabsContent value="security">
        <SecuritySettingsTab user={user} />
      </TabsContent>
    </Tabs>
  )
}

function PersonalInformationTab({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    nationality: user.nationality,
    address: user.address,
  })

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving personal information:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      nationality: user.nationality,
      address: user.address,
    })
    setIsEditing(false)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your personal details and contact information</CardDescription>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            {isEditing ? (
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            {isEditing ? (
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">
                {new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            {isEditing ? (
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-900 font-medium capitalize">{user.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            {isEditing ? (
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.nationality}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          {isEditing ? (
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          ) : (
            <p className="text-gray-900 font-medium">{user.address}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmploymentInformationTab({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    employerName: user.employerName,
    jobTitle: user.jobTitle,
    employmentType: user.employmentType,
    monthlyIncome: user.monthlyIncome,
    payFrequency: user.payFrequency,
  })

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving employment information:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      employerName: user.employerName,
      jobTitle: user.jobTitle,
      employmentType: user.employmentType,
      monthlyIncome: user.monthlyIncome,
      payFrequency: user.payFrequency,
    })
    setIsEditing(false)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Employment Information</CardTitle>
          <CardDescription>Update your employment details and income information</CardDescription>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="employerName">Employer Name</Label>
            {isEditing ? (
              <Input
                id="employerName"
                value={formData.employerName}
                onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.employerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            {isEditing ? (
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.jobTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type</Label>
            {isEditing ? (
              <Select
                value={formData.employmentType}
                onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
              >
                <SelectTrigger>
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
            ) : (
              <p className="text-gray-900 font-medium capitalize">{user.employmentType.replace("-", " ")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income</Label>
            {isEditing ? (
              <Input
                id="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">${Number.parseInt(user.monthlyIncome).toLocaleString()}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payFrequency">Pay Frequency</Label>
            {isEditing ? (
              <Select
                value={formData.payFrequency}
                onValueChange={(value) => setFormData({ ...formData, payFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="irregular">Irregular</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-900 font-medium capitalize">{user.payFrequency.replace("-", " ")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BankingInformationTab({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bankName: user.bankName,
    accountNumber: "",
    routingNumber: "",
  })

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving banking information:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      bankName: user.bankName,
      accountNumber: "",
      routingNumber: "",
    })
    setIsEditing(false)
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Banking Information</CardTitle>
          <CardDescription>Manage your banking details for loan disbursement</CardDescription>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            {isEditing ? (
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.bankName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            {isEditing ? (
              <Input
                id="accountNumber"
                placeholder="Enter full account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.accountNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="routingNumber">Routing Number</Label>
            {isEditing ? (
              <Input
                id="routingNumber"
                placeholder="Enter routing number"
                value={formData.routingNumber}
                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium">{user.routingNumber}</p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900">Your banking information is secure</h4>
              <p className="text-sm text-blue-700 mt-1">
                We use bank-level encryption to protect your financial data. Your information is never stored in plain
                text and is only used for loan disbursement purposes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SecuritySettingsTab({ user }: { user: any }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password change logic
    console.log("Password change request")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Authentication</p>
              <p className="text-sm text-gray-600">Receive verification codes via SMS</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Loan updates and account activity</p>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-600">Important security alerts</p>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
