"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import LoginImage from "@/assets/images/auth/loginImage.png"
import { useAuth } from "./AuthContext"

export default function AuthLayout() {
  const router = useRouter()
  const { login, register } = useAuth()

  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email) newErrors.email = "Email is required"
    else if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address"

    if (isSignUp) {
      if (!formData.username) newErrors.username = "Username is required"
      else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters"
      else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = "Username can only contain letters, numbers, and underscores"

      if (!formData.first_name) newErrors.first_name = "First name is required"
      else if (formData.first_name.trim().length < 2) newErrors.first_name = "First name must be at least 2 characters"

      if (!formData.last_name) newErrors.last_name = "Last name is required"
      else if (formData.last_name.trim().length < 2) newErrors.last_name = "Last name must be at least 2 characters"

      if (!formData.password_confirm) newErrors.password_confirm = "Please confirm your password"
      else if (formData.password !== formData.password_confirm) newErrors.password_confirm = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting")
      return
    }

    setLoading(true)
    setErrors({})

    try {
      if (!isSignUp) {
        // delegate login to AuthContext
        await login({ email: formData.email, password: formData.password })
        toast.success("Welcome back!")
        router.push("/profile")
      } else {
        // delegate register to AuthContext
        await register({
          email: formData.email,
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          password_confirm: formData.password_confirm,
        })
        toast.success("Registration successful! Please check your email for verification.")
        router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
      }
    } catch (err) {
      const message = err?.message || "Authentication failed"
      setErrors({ general: message })
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                  <Image src="/logo.png" alt="Pen Tutor Logo" className="w-36" width={144} height={40} />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
                <p className="text-gray-600">{isSignUp ? "Join our learning community" : "Sign in to your account"}</p>
              </div>

              {errors.general && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="Enter your username" value={formData.username} onChange={(e) => handleInputChange("username", e.target.value)} className={errors.username ? "border-red-500" : ""} disabled={loading} />
                      {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" placeholder="Enter your first name" value={formData.first_name} onChange={(e) => handleInputChange("first_name", e.target.value)} className={errors.first_name ? "border-red-500" : ""} disabled={loading} />
                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" placeholder="Enter your last name" value={formData.last_name} onChange={(e) => handleInputChange("last_name", e.target.value)} className={errors.last_name ? "border-red-500" : ""} disabled={loading} />
                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={errors.email ? "border-red-500" : ""} disabled={loading} />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className={errors.password ? "border-red-500" : ""} disabled={loading} />
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" disabled={loading}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {isSignUp && (
                  <div>
                    <Label htmlFor="password_confirm">Confirm Password</Label>
                    <div className="relative">
                      <Input id="password_confirm" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.password_confirm} onChange={(e) => handleInputChange("password_confirm", e.target.value)} className={errors.password_confirm ? "border-red-500" : ""} disabled={loading} />
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" disabled={loading}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password_confirm && <p className="text-red-500 text-sm mt-1">{errors.password_confirm}</p>}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"} {" "}
                  <Button variant="link" onClick={() => { setIsSignUp(!isSignUp); setErrors({}) }} className="p-0 text-primary" disabled={loading}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Button>
                </p>
              </div>
            </div>

            <div className={`relative overflow-hidden rounded-r-2xl bg-gradient-to-br from-primary/90 to-primary`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src={LoginImage} alt="Learning Community" width={350} height={400} className="object-contain max-w-[350px] max-h-[400px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
