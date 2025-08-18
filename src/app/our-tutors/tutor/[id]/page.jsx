"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, Users, Clock, Calendar, Mail, Globe, Award, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/ui/sidebar"
import { toast } from "sonner"
import axios from "axios"

export default function TutorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tutorId = params.id 
  console.log("tutorId", tutorId)
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  // Check user role from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setIsAdmin(userData.role === "admin")
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const fetchTutorDetail = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/courses/teachers/${tutorId}`)
      console.log("response", response)

      if (response.status === 200) {
        setTutor(response.data)
      } else {
        throw new Error("Failed to fetch tutor details")
      }
    } catch (error) {
      console.error("Error fetching tutor detail:", error)
      toast.error("Failed to load tutor details")
      setTutor(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tutorId) {
      fetchTutorDetail()
    }
  }, [tutorId])

  const getDisplayName = (teacher) => {
    if (isAdmin) {
      return `${teacher.first_name} ${teacher.last_name}`
    }
    return `Teacher #${teacher.id}`
  }

  const getAvailabilityDays = (schedule) => {
    return Object.entries(schedule).map(([day, time]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      time,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-64 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-64 p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutor not found</h2>
            <p className="text-gray-600 mb-4">The tutor you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/our-tutor")}>Back to Tutors</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:ml-64 px-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-[#313D6A] hover:text-[#F5BB07]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutors
          </Button>
        </div>

        {/* Tutor Hero Section */}
        <div className="bg-gradient-to-r rounded-lg from-[#313D6A] to-[#313D6A]/80 text-white px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={tutor.profile_picture || "/placeholder.svg"} alt={getDisplayName(tutor)} />
                    <AvatarFallback className="bg-white text-[#313D6A] text-2xl">
                      {isAdmin ? `${tutor.first_name[0]}${tutor.last_name[0]}` : `T${tutor.id}`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">{getDisplayName(tutor)}</h1>
                    {isAdmin && <p className="text-lg text-gray-200 mb-2">@{tutor.username}</p>}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>4.8 (150+ reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>500+ students</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-200 mb-6">
                  {tutor.bio ||
                    "Experienced educator passionate about teaching and helping students achieve their academic goals through personalized learning approaches."}
                </p>

                <div className="flex flex-wrap gap-2">
                  {tutor.expertise_areas.map((area, index) => (
                    <Badge key={index} className="bg-[#F5BB07] text-white">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-center lg:text-right">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-2xl font-bold mb-2">$45/hour</div>
                  <p className="text-sm text-gray-200 mb-4">Starting rate</p>
                  <Button className="w-full bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold">
                    Book a Session
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-white text-white hover:bg-white hover:text-[#313D6A] bg-transparent"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Tutor
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tutor Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="availability">Schedule</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">About This Tutor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Expertise Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {tutor.expertise_areas.map((area, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#313D6A]/10 text-[#313D6A]">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Course Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {tutor.course_categories.map((category, index) => (
                            <Badge key={index} className="bg-[#F5BB07]/20 text-[#313D6A]">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Teaching Methods</h3>
                        <div className="flex flex-wrap gap-2">
                          {tutor.preferred_teaching_methods.map((method, index) => (
                            <Badge key={index} variant="outline" className="border-[#313D6A]/30 text-[#313D6A]">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Languages Spoken</h3>
                        <div className="flex flex-wrap gap-2">
                          {tutor.languages_spoken.map((language, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                              <Globe className="h-4 w-4 text-[#313D6A]" />
                              <span className="text-sm">{language}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">Educational Background</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {tutor.education.map((edu, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                            <div className="bg-[#313D6A] p-2 rounded-full">
                              <Award className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#313D6A] text-lg">{edu.degree}</h3>
                              <p className="text-gray-600 mb-1">{edu.institution}</p>
                              <p className="text-sm text-gray-500">Graduated: {edu.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="availability" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">Weekly Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getAvailabilityDays(tutor.availability_schedule).map((slot, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-[#313D6A]" />
                              <span className="font-medium">{slot.day}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{slot.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">Student Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Mock reviews */}
                        {[
                          {
                            name: "Sarah M.",
                            rating: 5,
                            comment: "Excellent tutor! Very patient and explains concepts clearly.",
                            date: "2 weeks ago",
                          },
                          {
                            name: "John D.",
                            rating: 5,
                            comment: "Helped me improve my grades significantly. Highly recommended!",
                            date: "1 month ago",
                          },
                          {
                            name: "Emily R.",
                            rating: 4,
                            comment: "Great teaching style and very knowledgeable in the subject.",
                            date: "1 month ago",
                          },
                        ].map((review, index) => (
                          <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback className="bg-[#313D6A] text-white">
                                  {review.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{review.name}</h4>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Quick Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-[#313D6A]">Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">Within 2 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Students</span>
                      <span className="font-medium">500+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium text-green-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">5+ years</span>
                    </div>
                    {isAdmin && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Email</span>
                        </div>
                        <p className="text-sm text-[#313D6A] break-all">{tutor.email}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#313D6A]">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Top Rated Tutor</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">500+ Hours Taught</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Verified Education</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Background Checked</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
