interface FrappeConfig {
  baseUrl: string
  apiKey?: string
  apiSecret?: string
  accessToken?: string
}

interface FrappeResponse<T = any> {
  message: T
  data?: T
  exc?: string
  exc_type?: string
}

interface LoginCredentials {
  usr: string
  pwd: string
}

class FrappeAPI {
  private config: FrappeConfig
  private sessionCookie?: string

  constructor(config: FrappeConfig) {
    this.config = config
  }

  // Token-based authentication (recommended for production)
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (this.config.apiKey && this.config.apiSecret) {
      // Token-based authentication
      const token = `${this.config.apiKey}:${this.config.apiSecret}`
      headers["Authorization"] = `token ${token}`
    } else if (this.config.accessToken) {
      // OAuth 2 Bearer token
      headers["Authorization"] = `Bearer ${this.config.accessToken}`
    } else if (this.sessionCookie) {
      // Session-based authentication
      headers["Cookie"] = this.sessionCookie
    }

    return headers
  }

  // Login with username and password (session-based)
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/method/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        // Extract session cookie from response
        const setCookie = response.headers.get("set-cookie")
        if (setCookie) {
          this.sessionCookie = setCookie
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Frappe login error:", error)
      return false
    }
  }

  // Logout (session-based)
  async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/method/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        this.sessionCookie = undefined
        return true
      }
      return false
    } catch (error) {
      console.error("Frappe logout error:", error)
      return false
    }
  }

  // Generic API request method
  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<FrappeResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.exc || `HTTP ${response.status}: ${response.statusText}`)
      }

      return data
    } catch (error) {
      console.error("Frappe API request error:", error)
      throw error
    }
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<FrappeResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<FrappeResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<FrappeResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<FrappeResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // Get a document by doctype and name
  async getDoc<T = any>(doctype: string, name: string): Promise<T> {
    const response = await this.get<T>(`/api/resource/${doctype}/${name}`)
    return response.data || response.message
  }

  // Get multiple documents with filters
  async getDocList<T = any>(
    doctype: string,
    options: {
      fields?: string[]
      filters?: Record<string, any>
      limit?: number
      offset?: number
      orderBy?: string
    } = {},
  ): Promise<T[]> {
    const params = new URLSearchParams()

    if (options.fields) {
      params.append("fields", JSON.stringify(options.fields))
    }
    if (options.filters) {
      params.append("filters", JSON.stringify(options.filters))
    }
    if (options.limit) {
      params.append("limit", options.limit.toString())
    }
    if (options.offset) {
      params.append("offset", options.offset.toString())
    }
    if (options.orderBy) {
      params.append("order_by", options.orderBy)
    }

    const queryString = params.toString()
    const endpoint = `/api/resource/${doctype}${queryString ? `?${queryString}` : ""}`

    const response = await this.get<T[]>(endpoint)
    return response.data || response.message
  }

  // Create a new document
  async createDoc<T = any>(doctype: string, data: any): Promise<T> {
    const response = await this.post<T>(`/api/resource/${doctype}`, data)
    return response.data || response.message
  }

  // Update a document
  async updateDoc<T = any>(doctype: string, name: string, data: any): Promise<T> {
    const response = await this.put<T>(`/api/resource/${doctype}/${name}`, data)
    return response.data || response.message
  }

  // Delete a document
  async deleteDoc(doctype: string, name: string): Promise<boolean> {
    try {
      await this.delete(`/api/resource/${doctype}/${name}`)
      return true
    } catch (error) {
      console.error("Delete document error:", error)
      return false
    }
  }

  // Call a server method
  async call<T = any>(method: string, args?: Record<string, any>): Promise<T> {
    const endpoint = `/api/method/${method}`
    const response = await this.post<T>(endpoint, args)
    return response.message
  }

  // Upload a file
  async uploadFile(
    file: File,
    options: {
      doctype?: string
      docname?: string
      fieldname?: string
      folder?: string
      isPrivate?: boolean
    } = {},
  ): Promise<any> {
    const formData = new FormData()
    formData.append("file", file)

    if (options.doctype) formData.append("doctype", options.doctype)
    if (options.docname) formData.append("docname", options.docname)
    if (options.fieldname) formData.append("fieldname", options.fieldname)
    if (options.folder) formData.append("folder", options.folder)
    if (options.isPrivate !== undefined) formData.append("is_private", options.isPrivate.toString())

    const headers = this.getAuthHeaders()
    delete headers["Content-Type"] // Let browser set content-type for FormData

    try {
      const response = await fetch(`${this.config.baseUrl}/api/method/upload_file`, {
        method: "POST",
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.exc || `Upload failed: ${response.statusText}`)
      }

      return data.message
    } catch (error) {
      console.error("File upload error:", error)
      throw error
    }
  }
}

// Create and export a configured Frappe API instance
const frappeConfig: FrappeConfig = {
  baseUrl: process.env.NEXT_PUBLIC_FRAPPE_URL || "https://lending12.m.frappe.cloud",
  apiKey: process.env.FRAPPE_API_KEY,
  apiSecret: process.env.FRAPPE_API_SECRET,
  // accessToken: process.env.FRAPPE_ACCESS_TOKEN,
}

export const frappeAPI = new FrappeAPI(frappeConfig)
export { FrappeAPI, type FrappeConfig, type FrappeResponse }
