"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// PUBLIC axios instance (no Authorization header injected)
const publicApi = axios.create({
  baseURL: API_BASE,
  // don't set common Authorization here
})

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const params = useParams()            // route params (e.g. /verify/[token])
  const searchParams = useSearchParams() // query string params
  const token = params?.token
  const email = searchParams?.get?.("email") ?? undefined

  useEffect(() => {
    // Quick debug logs (remove later)
    console.log("global Authorization:", axios.defaults.headers?.common?.Authorization)
    console.log("publicApi Authorization:", publicApi.defaults.headers?.common?.Authorization)

    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link.")
      return
    }

    const verifyEmail = async () => {
      try {
        setStatus("loading")
        setMessage("Verifying...")

        // Use publicApi so no Authorization header is sent
        const res = await publicApi.get(`/api/auth/verify-email/${encodeURIComponent(token)}/`)
        if (res.status === 200 && res.data) {
          setStatus("success")
          setMessage(res.data.message || "Your email has been successfully verified!")
          setTimeout(() => router.push("/auth"), 2500)
        } else {
          setStatus("error")
          setMessage(res.data?.message || `Verification failed (status ${res.status})`)
        }
      } catch (err) {
        console.error("Verification error:", err)
        const detail =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          (err?.response?.data && JSON.stringify(err.response.data)) ||
          err?.message
        setStatus("error")
        setMessage(typeof detail === "string" ? detail : "Something went wrong. Please try again later.")
      }
    }

    verifyEmail()
  }, [token, router])

  const resendVerificationEmail = async () => {
    try {
      if (!email) {
        setStatus("error")
        setMessage("Email missing. Please go back to the login/registration page and open the link from your email again.")
        return
      }

      setStatus("loading")
      setMessage("Resending verification email...")

      // Use publicApi so Authorization isn't sent
      const res = await publicApi.post("/api/auth/resend-verification/", { email })

      if (res.status === 200 && res.data) {
        setStatus("success")
        setMessage(res.data.message || "Verification email resent successfully!")
      } else {
        setStatus("error")
        setMessage(res.data?.message || "Failed to resend verification email.")
      }
    } catch (err) {
      console.error("Resend verification error:", err)
      const detail =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err?.message
      setStatus("error")
      setMessage(typeof detail === "string" ? detail : "Something went wrong. Please try again later.")
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 animate-spin" style={{ color: "#F5BB07" }} />
      case "success":
        return <CheckCircle className="h-16 w-16" style={{ color: "#F5BB07" }} />
      case "error":
      default:
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case "loading":
        return "Verifying Your Email..."
      case "success":
        return "Email Verified!"
      case "error":
      default:
        return "Verification Failed"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#313D6A" }}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">{getStatusIcon()}</div>
          <CardTitle className="text-2xl font-bold" style={{ color: "#313D6A" }}>
            {getStatusTitle()}
          </CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Redirecting you to the login page...</p>
              <Button onClick={() => router.push("/auth")} className="w-full font-semibold" style={{ backgroundColor: "#F5BB07", color: "#313D6A", border: "none" }}>
                Continue to Login
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Button onClick={() => router.push("/auth")} className="w-full font-semibold" style={{ backgroundColor: "#F5BB07", color: "#313D6A", border: "none" }}>
                Back to Login
              </Button>

              <Button variant="outline" onClick={resendVerificationEmail} className="w-full font-semibold hover:text-white" style={{ borderColor: "#313D6A", color: "#313D6A" }}>
                Resend Verification Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
