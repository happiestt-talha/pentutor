"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // ----- Public API (no Authorization header) -----
  const publicApi = axios.create({ baseURL: API_BASE })

  // ----- Private API (will have Authorization header when logged in) -----
  const privateApi = axios.create({ baseURL: API_BASE })

  // Refresh endpoint - adjust if your backend uses a different path
  const REFRESH_ENDPOINT = "/api/auth/refresh/" // <- change if needed

  // keep track of refreshing state to queue requests
  const isRefreshing = useRef(false)
  const failedQueue = useRef([])

  // helper to resolve/reject queued requests while refreshing token
  const processQueue = (error, token = null) => {
    failedQueue.current.forEach((prom) => {
      if (error) prom.reject(error)
      else prom.resolve(token)
    })
    failedQueue.current = []
  }

  // Interceptor: when privateApi receives 401, try refresh once, then retry original request
  useEffect(() => {
    const interceptor = privateApi.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config

        // only handle 401s (unauthorized)
        if (!error.response || error.response.status !== 401) {
          return Promise.reject(error)
        }

        // avoid infinite retry loops
        if (originalRequest._retry) {
          return Promise.reject(error)
        }
        originalRequest._retry = true

        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          // nothing to refresh with -> clear auth and fail
          clearAuthData()
          return Promise.reject(error)
        }

        // If another refresh is already in progress, queue this request
        if (isRefreshing.current) {
          return new Promise(function (resolve, reject) {
            failedQueue.current.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`
              return privateApi(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        isRefreshing.current = true

        try {
          // use publicApi for refresh so we don't send stale Authorization header
          const resp = await publicApi.post(REFRESH_ENDPOINT, { refresh_token: refreshToken })

          // adapt to your backend shape (some return access_token at resp.data.access_token)
          const newAccessToken = resp?.data?.data?.access_token ?? resp?.data?.access_token ?? null

          if (!newAccessToken) {
            throw new Error("No refreshed access token returned")
          }

          // persist tokens and update privateApi header
          const newRefresh = resp?.data?.data?.refresh_token ?? refreshToken
          localStorage.setItem("access_token", newAccessToken)
          localStorage.setItem("refresh_token", newRefresh)
          privateApi.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`

          // resolve queued requests
          processQueue(null, newAccessToken)
          isRefreshing.current = false

          // retry original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
          return privateApi(originalRequest)
        } catch (err) {
          processQueue(err, null)
          isRefreshing.current = false
          clearAuthData()
          router.push("/auth")
          return Promise.reject(err)
        }
      }
    )

    return () => {
      privateApi.interceptors.response.eject(interceptor)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // clear tokens and user state
  const clearAuthData = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_data")
    delete privateApi.defaults.headers.common["Authorization"]
    delete axios.defaults.headers.common["Authorization"] // defensive
    setUser(null)
  }

  // Initialize auth header (on mount) - read stored tokens/user
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        privateApi.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } catch (err) {
        console.error("Error parsing stored user:", err)
        clearAuthData()
      }
    }
    setLoading(false)
  }, [])

  // keep localStorage in sync whenever `user` changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user_data", JSON.stringify(user))
      } catch (e) {
        console.error("Failed to write user_data to localStorage:", e)
      }
    } else {
      localStorage.removeItem("user_data")
    }
  }, [user])

  // ----- Public actions: login / register use publicApi (no Authorization header) -----
  const login = async (credentials) => {
    try {
      const response = await publicApi.post("/api/auth/login/", credentials)
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Login failed")
      }

      const { access_token, refresh_token, user: userData } = response.data.data

      // persist tokens + user
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user_data", JSON.stringify(userData))

      // set privateApi header for subsequent protected requests
      privateApi.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

      setUser(userData)
      return userData
    } catch (error) {
      console.error("Login failed:", error)
      const message = error?.response?.data?.message || error?.response?.data?.detail || error.message || "Login failed"
      throw new Error(message)
    }
  }

  const register = async (userData) => {
    try {
      const response = await publicApi.post("/api/auth/register/", userData)
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Registration failed")
      }
      // registration usually does not log the user in; return response
      return response.data
    } catch (error) {
      console.error("Registration failed:", error)
      const message = error?.response?.data?.message || error?.response?.data?.detail || error.message || "Registration failed"
      throw new Error(message)
    }
  }

  // protected profile fetch uses privateApi (no manual headers)
  const refetchUser = async () => {
    try {
      const response = await privateApi.get("/api/auth/profile/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      console.log("Refetch user response", response)

      // normalize user object extraction depending on backend
      const userObj = response.data?.data ?? response.data

      // update React state
      setUser(userObj)

      // persist immediately so other code reading localStorage sees the update
      try {
        localStorage.setItem("user_data", JSON.stringify(userObj))
      } catch (e) {
        console.error("Failed to write user_data to localStorage:", e)
      }

      console.log("Refetch user userObj", userObj)
      return userObj
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error("Failed to fetch user data, please login again.")
      throw error
    }
  }

  const logout = async () => {
    const token = localStorage.getItem("refresh_token")
    try {
      const response = await publicApi.post("/api/auth/logout/", { refresh_token: token })
      if (response.status === 200) {
        clearAuthData()
        router.push("/")
      } else {
        toast.error(response.data?.message || "Logout failed")
      }
    } catch (error) {
      console.error("Logout failed:", error)
      clearAuthData()
      toast.error(error?.response?.data?.message || error?.message || "Logout failed")
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    refetchUser,
    isAuthenticated: !!user,
    publicApi,
    privateApi,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
