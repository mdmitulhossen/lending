import { frappeAPI } from "./frappe-api"
import type { FrappeUser, FrappeCustomer, LoanApplication, Loan, LoanPayment } from "./frappe-types"

// Authentication Services
export class AuthService {
  static async login(email: string, password: string): Promise<boolean> {
    try {
      return await frappeAPI.login({ usr: email, pwd: password })
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  static async logout(): Promise<boolean> {
    try {
      return await frappeAPI.logout()
    } catch (error) {
      console.error("Logout failed:", error)
      return false
    }
  }

  static async getCurrentUser(): Promise<FrappeUser | null> {
    try {
      const response = await frappeAPI.call("frappe.auth.get_logged_user")
      if (response) {
        return await frappeAPI.getDoc<FrappeUser>("User", response)
      }
      return null
    } catch (error) {
      console.error("Get current user failed:", error)
      return null
    }
  }

  static async createUser(userData: {
    email: string
    first_name: string
    last_name: string
    password: string
    phone?: string
    send_welcome_email?: boolean
  }): Promise<FrappeUser | null> {
    try {
      const user = await frappeAPI.createDoc<FrappeUser>("User", {
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: `${userData.first_name} ${userData.last_name}`,
        mobile_no: userData.phone,
        user_type: "Website User",
        enabled: 1,
        new_password: userData.password,
        send_welcome_email: userData.send_welcome_email || false,
      })
      return user
    } catch (error) {
      console.error("Create user failed:", error)
      return null
    }
  }
}

// Customer Services
export class CustomerService {
  static async createCustomer(customerData: {
    customer_name: string
    email_id: string
    mobile_no?: string
    date_of_birth?: string
    nationality?: string
    address?: string
  }): Promise<FrappeCustomer | null> {
    try {
      const customer = await frappeAPI.createDoc<FrappeCustomer>("Customer", {
        customer_name: customerData.customer_name,
        customer_type: "Individual",
        customer_group: "Individual",
        territory: "All Territories",
        email_id: customerData.email_id,
        mobile_no: customerData.mobile_no,
        date_of_birth: customerData.date_of_birth,
        nationality: customerData.nationality,
        customer_primary_address: customerData.address,
      })
      return customer
    } catch (error) {
      console.error("Create customer failed:", error)
      return null
    }
  }

  static async getCustomer(customerId: string): Promise<FrappeCustomer | null> {
    try {
      return await frappeAPI.getDoc<FrappeCustomer>("Customer", customerId)
    } catch (error) {
      console.error("Get customer failed:", error)
      return null
    }
  }

  static async updateCustomer(customerId: string, updateData: Partial<FrappeCustomer>): Promise<FrappeCustomer | null> {
    try {
      return await frappeAPI.updateDoc<FrappeCustomer>("Customer", customerId, updateData)
    } catch (error) {
      console.error("Update customer failed:", error)
      return null
    }
  }
}

// Loan Application Services
export class LoanApplicationService {
  static async submitApplication(applicationData: {
    applicant: string
    loan_amount: number
    loan_term: number
    loan_purpose: string
    purpose_description?: string
    date_of_birth: string
    address: string
    employer_name: string
    job_title: string
    employment_type: string
    monthly_income: number
    bank_name: string
    account_type: string
    account_number: string
    routing_number: string
    terms_accepted: boolean
    credit_check_consent: boolean
    data_usage_consent: boolean
    marketing_consent?: boolean
  }): Promise<LoanApplication | null> {
    try {
      const application = await frappeAPI.createDoc<LoanApplication>("Loan Application", {
        ...applicationData,
        application_status: "Submitted",
        application_date: new Date().toISOString().split("T")[0],
        terms_accepted: applicationData.terms_accepted ? 1 : 0,
        credit_check_consent: applicationData.credit_check_consent ? 1 : 0,
        data_usage_consent: applicationData.data_usage_consent ? 1 : 0,
        marketing_consent: applicationData.marketing_consent ? 1 : 0,
      })
      return application
    } catch (error) {
      console.error("Submit application failed:", error)
      return null
    }
  }

  static async getApplication(applicationId: string): Promise<LoanApplication | null> {
    try {
      return await frappeAPI.getDoc<LoanApplication>("Loan Application", applicationId)
    } catch (error) {
      console.error("Get application failed:", error)
      return null
    }
  }

  static async getCustomerApplications(customerId: string): Promise<LoanApplication[]> {
    try {
      return await frappeAPI.getDocList<LoanApplication>("Loan Application", {
        filters: { applicant: customerId },
        orderBy: "creation desc",
      })
    } catch (error) {
      console.error("Get customer applications failed:", error)
      return []
    }
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: string,
    notes?: string,
  ): Promise<LoanApplication | null> {
    try {
      return await frappeAPI.updateDoc<LoanApplication>("Loan Application", applicationId, {
        application_status: status,
        processing_notes: notes,
      })
    } catch (error) {
      console.error("Update application status failed:", error)
      return null
    }
  }

  static async uploadDocument(
    applicationId: string,
    file: File,
    documentType: "government_id" | "proof_of_address" | "proof_of_income" | "bank_statement",
  ): Promise<string | null> {
    try {
      const uploadResult = await frappeAPI.uploadFile(file, {
        doctype: "Loan Application",
        docname: applicationId,
        fieldname: documentType,
        isPrivate: true,
      })

      // Update the application with the file URL
      await frappeAPI.updateDoc("Loan Application", applicationId, {
        [documentType]: uploadResult.file_url,
      })

      return uploadResult.file_url
    } catch (error) {
      console.error("Upload document failed:", error)
      return null
    }
  }
}

// Loan Services
export class LoanService {
  static async getCustomerLoans(customerId: string): Promise<Loan[]> {
    try {
      return await frappeAPI.getDocList<Loan>("Loan", {
        filters: { customer: customerId },
        orderBy: "creation desc",
      })
    } catch (error) {
      console.error("Get customer loans failed:", error)
      return []
    }
  }

  static async getLoan(loanId: string): Promise<Loan | null> {
    try {
      return await frappeAPI.getDoc<Loan>("Loan", loanId)
    } catch (error) {
      console.error("Get loan failed:", error)
      return null
    }
  }

  static async getLoanPayments(loanId: string): Promise<LoanPayment[]> {
    try {
      return await frappeAPI.getDocList<LoanPayment>("Loan Payment", {
        filters: { loan: loanId },
        orderBy: "payment_date desc",
      })
    } catch (error) {
      console.error("Get loan payments failed:", error)
      return []
    }
  }

  static async makePayment(paymentData: {
    loan: string
    customer: string
    payment_amount: number
    payment_method: string
    payment_reference?: string
  }): Promise<LoanPayment | null> {
    try {
      const payment = await frappeAPI.createDoc<LoanPayment>("Loan Payment", {
        ...paymentData,
        payment_date: new Date().toISOString().split("T")[0],
        payment_status: "Pending",
      })
      return payment
    } catch (error) {
      console.error("Make payment failed:", error)
      return null
    }
  }
}

// Dashboard Services
export class DashboardService {
  static async getCustomerDashboard(customerId: string): Promise<{
    customer: FrappeCustomer
    activeLoans: Loan[]
    completedLoans: Loan[]
    pendingApplications: LoanApplication[]
    totalBorrowed: number
    totalPaid: number
    creditScore?: number
  } | null> {
    try {
      const [customer, loans, applications] = await Promise.all([
        CustomerService.getCustomer(customerId),
        LoanService.getCustomerLoans(customerId),
        LoanApplicationService.getCustomerApplications(customerId),
      ])

      if (!customer) return null

      const activeLoans = loans.filter((loan) => loan.loan_status === "Active")
      const completedLoans = loans.filter((loan) => loan.loan_status === "Completed")
      const pendingApplications = applications.filter((app) =>
        ["Submitted", "Under Review"].includes(app.application_status),
      )

      const totalBorrowed = loans.reduce((sum, loan) => sum + loan.loan_amount, 0)
      const totalPaid = loans.reduce((sum, loan) => sum + (loan.loan_amount - loan.remaining_balance), 0)

      return {
        customer,
        activeLoans,
        completedLoans,
        pendingApplications,
        totalBorrowed,
        totalPaid,
        creditScore: 720, // This would come from a credit scoring service
      }
    } catch (error) {
      console.error("Get customer dashboard failed:", error)
      return null
    }
  }
}

export const frappeAuth = {
  async login(email: string, password: string) {
    try {
      const success = await AuthService.login(email, password)
      if (success) {
        const user = await AuthService.getCurrentUser()
        return {
          success: true,
          user,
          token: "session-based", // Frappe uses session-based auth
        }
      }
      return { success: false, error: "Invalid credentials" }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  },

  async logout() {
    return await AuthService.logout()
  },

  async getCurrentUser() {
    return await AuthService.getCurrentUser()
  },

  async createUser(userData: any) {
    return await AuthService.createUser(userData)
  },
}

export const customerService = {
  async createCustomer(customerData: any) {
    try {
      // First create the user account
      const user = await AuthService.createUser({
        email: customerData.email_id,
        first_name: customerData.customer_name.split(" ")[0],
        last_name: customerData.customer_name.split(" ").slice(1).join(" "),
        password: "temp-password", // This should be handled differently in production
        phone: customerData.mobile_no,
      })

      if (!user) {
        return { success: false, error: "Failed to create user account" }
      }

      // Then create the customer record
      const customer = await CustomerService.createCustomer(customerData)

      if (customer) {
        return { success: true, data: customer }
      }
      return { success: false, error: "Failed to create customer record" }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    }
  },

  async getCustomer(customerId: string) {
    return await CustomerService.getCustomer(customerId)
  },

  async updateCustomer(customerId: string, updateData: any) {
    return await CustomerService.updateCustomer(customerId, updateData)
  },
}

export const loanApplicationService = {
  async submitApplication(applicationData: any) {
    try {
      const application = await LoanApplicationService.submitApplication(applicationData)
      if (application) {
        return { success: true, data: application }
      }
      return { success: false, error: "Failed to submit application" }
    } catch (error) {
      return { success: false, error: "Application submission failed" }
    }
  },

  async getApplication(applicationId: string) {
    return await LoanApplicationService.getApplication(applicationId)
  },

  async getCustomerApplications(customerId: string) {
    return await LoanApplicationService.getCustomerApplications(customerId)
  },

  async uploadDocument(applicationId: string, file: File, documentType: any) {
    return await LoanApplicationService.uploadDocument(applicationId, file, documentType)
  },
}

export const loanService = {
  async getCustomerLoans(customerId: string) {
    return await LoanService.getCustomerLoans(customerId)
  },

  async getLoan(loanId: string) {
    return await LoanService.getLoan(loanId)
  },

  async getLoanPayments(loanId: string) {
    return await LoanService.getLoanPayments(loanId)
  },

  async makePayment(paymentData: any) {
    return await LoanService.makePayment(paymentData)
  },
}

export const dashboardService = {
  async getCustomerDashboard(customerId: string) {
    return await DashboardService.getCustomerDashboard(customerId)
  },
}
