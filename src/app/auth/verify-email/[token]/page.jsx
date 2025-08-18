"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"


export default function VerifyEmailPage() {
    const [status, setStatus] = useState("loading")
    const [message, setMessage] = useState("")
    const router = useRouter()
    const params = useParams()
    const token = params.token 

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Simulate verification process
                await new Promise((resolve) => setTimeout(resolve, 2000))

                // Mock verification logic - replace with your actual API call
                if (!token || token === "invalid") {
                    setStatus("error")
                    setMessage("Invalid verification link.")
                    return
                }

                if (token === "expired") {
                    setStatus("expired")
                    setMessage("This verification link has expired.")
                    return
                }

                // Simulate successful verification
                setStatus("success")
                setMessage("Your email has been successfully verified!")

                // Redirect to auth page after 3 seconds
                setTimeout(() => {
                    router.push("/auth")
                }, 3000)
            } catch (error) {
                console.error("Verification error:", error)
                setStatus("error")
                setMessage("Something went wrong. Please try again.")
            }
        }

        if (token) {
            verifyEmail()
        } else {
            setStatus("error")
            setMessage("Invalid verification link.")
        }
    }, [token, router])

    const getStatusIcon = () => {
        switch (status) {
            case "loading":
                return <Loader2 className="h-16 w-16 animate-spin" style={{ color: "#F5BB07" }} />
            case "success":
                return <CheckCircle className="h-16 w-16" style={{ color: "#F5BB07" }} />
            case "error":
            case "expired":
                return <XCircle className="h-16 w-16 text-red-500" />
        }
    }

    const getStatusTitle = () => {
        switch (status) {
            case "loading":
                return "Verifying Your Email..."
            case "success":
                return "Email Verified!"
            case "expired":
                return "Link Expired"
            case "error":
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
                            <p className="text-sm text-muted-foreground mb-4">
                                Redirecting you to the login page in a few seconds...
                            </p>
                            <Button
                                onClick={() => router.push("/auth")}
                                className="w-full font-semibold"
                                style={{
                                    backgroundColor: "#F5BB07",
                                    color: "#313D6A",
                                    border: "none",
                                }}
                            >
                                Continue to Login
                            </Button>
                        </div>
                    )}

                    {(status === "error" || status === "expired") && (
                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push("/auth")}
                                className="w-full font-semibold"
                                style={{
                                    backgroundColor: "#F5BB07",
                                    color: "#313D6A",
                                    border: "none",
                                }}
                            >
                                Back to Login
                            </Button>
                            {status === "expired" && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // You can implement resend verification logic here
                                        console.log("Resend verification email")
                                    }}
                                    className="w-full font-semibold hover:text-white"
                                    style={{
                                        borderColor: "#313D6A",
                                        color: "#313D6A",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#313D6A"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "transparent"
                                    }}
                                >
                                    Resend Verification Email
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
