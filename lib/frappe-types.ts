export interface FrappeDocument {
  name: string
  owner: string
  creation: string
  modified: string
  modified_by: string
  docstatus: 0 | 1 | 2 // Draft, Submitted, Cancelled
  idx: number
}

// User document type
export interface FrappeUser extends FrappeDocument {
  email: string
  first_name: string
  last_name: string
  full_name: string
  username?: string
  phone?: string
  mobile_no?: string
  gender?: "Male" | "Female" | "Other"
  birth_date?: string
  location?: string
  bio?: string
  user_image?: string
  enabled: 0 | 1
  user_type: "System User" | "Website User"
  role_profile_name?: string
  roles?: Array<{
    role: string
  }>
}

// Customer document type for loan applicants
export interface FrappeCustomer extends FrappeDocument {
  customer_name: string
  customer_type: "Individual" | "Company"
  customer_group: string
  territory: string
  email_id?: string
  mobile_no?: string
  phone?: string
  website?: string
  customer_primary_address?: string
  customer_primary_contact?: string
  default_currency?: string
  credit_limit?: number
  payment_terms?: string
  // Custom fields for loan application
  date_of_birth?: string
  nationality?: string
  employment_type?: string
  employer_name?: string
  job_title?: string
  monthly_income?: number
  bank_name?: string
  account_number?: string
  routing_number?: string
  verification_status?: "Pending" | "Verified" | "Rejected"
}

// Custom Loan Application document type
export interface LoanApplication extends FrappeDocument {
  applicant: string // Link to Customer
  applicant_name: string
  email: string
  phone: string

  // Loan Details
  loan_amount: number
  loan_term: number // in months
  loan_purpose: string
  purpose_description?: string
  interest_rate?: number
  monthly_payment?: number

  // Personal Information
  date_of_birth: string
  address: string
  nationality?: string

  // Employment Information
  employer_name: string
  job_title: string
  employment_type: "Full-time" | "Part-time" | "Gig Worker" | "Self-employed" | "Contract"
  monthly_income: number
  work_duration?: string

  // Banking Information
  bank_name: string
  account_type: "Checking" | "Savings"
  account_number: string
  routing_number: string

  // Application Status
  application_status: "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Disbursed"
  approval_date?: string
  rejection_reason?: string

  // Documents
  government_id?: string // File attachment
  proof_of_address?: string // File attachment
  proof_of_income?: string // File attachment
  bank_statement?: string // File attachment

  // Consents
  terms_accepted: 0 | 1
  credit_check_consent: 0 | 1
  data_usage_consent: 0 | 1
  marketing_consent: 0 | 1

  // System fields
  application_date: string
  processed_by?: string
  processing_notes?: string
}

// Loan document type for approved loans
export interface Loan extends FrappeDocument {
  loan_application: string // Link to Loan Application
  customer: string // Link to Customer
  customer_name: string

  // Loan Terms
  loan_amount: number
  interest_rate: number
  loan_term: number // in months
  monthly_payment: number
  total_interest: number
  total_amount: number

  // Loan Status
  loan_status: "Active" | "Completed" | "Defaulted" | "Closed"
  disbursement_date: string
  maturity_date: string

  // Payment Information
  next_payment_date?: string
  remaining_balance: number
  payments_made: number
  payments_remaining: number

  // Banking
  disbursement_account: string
  disbursement_reference?: string
}

// Payment Entry for loan payments
export interface LoanPayment extends FrappeDocument {
  loan: string // Link to Loan
  customer: string // Link to Customer

  // Payment Details
  payment_amount: number
  payment_date: string
  payment_method: "Bank Transfer" | "Credit Card" | "Debit Card" | "ACH" | "Check"
  payment_reference?: string

  // Payment Breakdown
  principal_amount: number
  interest_amount: number
  fees_amount?: number

  // Status
  payment_status: "Pending" | "Completed" | "Failed" | "Refunded"
  processing_fee?: number

  // System
  processed_by?: string
  processing_notes?: string
}

// File attachment type
export interface FrappeFile extends FrappeDocument {
  file_name: string
  file_url: string
  file_size: number
  content_hash?: string
  attached_to_doctype?: string
  attached_to_name?: string
  attached_to_field?: string
  folder: string
  is_private: 0 | 1
}

// API response types
export interface LoanApplicationResponse {
  application: LoanApplication
  customer: FrappeCustomer
  status: string
  message: string
}

export interface LoanListResponse {
  loans: Loan[]
  total_count: number
  has_more: boolean
}

export interface PaymentHistoryResponse {
  payments: LoanPayment[]
  total_paid: number
  remaining_balance: number
}
