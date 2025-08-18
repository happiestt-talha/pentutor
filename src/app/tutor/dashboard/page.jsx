"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Users, Video, FileQuestion, Monitor, Bell, Menu, X, Play, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/components/auth/AuthContext"

const mockUser = {
  teacher_name: "Dr. Sarah Johnson",
  avatar: "/teacher-avatar.png",
  experience_years: 8,
  hourly_rate: 75,
  teaching_subjects: ["Mathematics", "Physics", "Chemistry"],
}

function TutorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [teacherData, setTeacherData] = useState(null)
  const [teacherProfile, setTeacherProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const teacherResponse = await axios.get(`${API_BASE}/api/teacher/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
        console.log("Teacher Response:", teacherResponse)

        if (teacherResponse.status === 200) {
          setTeacherData(teacherResponse.data.data)
        } else {
          throw new Error("Failed to fetch teacher data")
        }
      } catch (error) {
        toast.error("Failed to fetch dashboard data.")
        console.error("Error fetching data:", error)
        setTeacherData(null)
      } finally {
        setLoading(false)
      }
    }

    //% TODO: Fetch teacher profile 
    // const fetchTeacherProfile = async () => {
    //   try {
    //     setLoading(true)

    //     const teacherProfileResponse = await axios.get(`${API_BASE}/api/teacher/${user.id}/`)
    //     console.log("Teacher Profile Response:", teacherProfileResponse.data.data)

    //     if (teacherProfileResponse.status === 200) {
    //       setTeacherProfile(teacherProfileResponse.data.data)
    //     } else {
    //       throw new Error("Failed to fetch teacher profile data")
    //     }
    //   } catch (error) {
    //     toast.error("Failed to fetch dashboard data.")
    //     console.error("Error fetching data:", error)
    //     setTeacherProfile(null)
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    fetchData()
    // fetchTeacherProfile()
  }, [])

  const handleVideoClick = (videoId) => {
    router.push(`/tutor/videos/${videoId}`)
  }

  const handleCourseClick = (courseId) => {
    router.push(`/courses/details/${courseId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#313D6A] mx-auto mb-4"></div>
          <p className="text-[#313D6A]">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const { teacher, statistics, videos, courses } = teacherData
  console.log("Teacher Data:", teacher)
  console.log("Statistics Data:", statistics)
  console.log("Videos Data:", videos)
  console.log("Courses Data:", courses)
  console.log("Teacher Profile Data:", teacherProfile)
  return (
    <div className="min-h-screen bg-white">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-[#313D6A] text-white transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor-dashboard")}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/courses")}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Courses
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/videos")}
            >
              <Video className="h-4 w-4 mr-3" />
              Videos
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/enrolled-students")}
            >
              <Users className="h-4 w-4 mr-3" />
              Students
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/quizzes")}
            >
              <FileQuestion className="h-4 w-4 mr-3" />
              Quizzes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/live-classes")}
            >
              <Monitor className="h-4 w-4 mr-3" />
              Live Classes
            </Button>
          </nav>
        </div>
      </div>

      <div className="lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-4 text-[#313D6A]"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#313D6A]">Tutor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {teacherData?.teacher_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
              >
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Avatar>
                <AvatarImage src={teacher?.avatar || "/placeholder.svg"} alt={teacher?.teacher_name} />
                <AvatarFallback className="bg-[#313D6A] text-white">
                  {teacher?.teacher_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <Card className="border-[#313D6A]/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-[#313D6A]" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[#313D6A]">{teacherData.recent_courses?.length}</div>
                    <div className="text-sm text-gray-600">Recent Courses</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#313D6A]/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-[#F5BB07]" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[#313D6A]">{statistics?.active_courses}</div>
                    <div className="text-sm text-gray-600">Active Courses</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#313D6A]/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-[#313D6A]" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[#313D6A]">{statistics?.total_students}</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#313D6A]/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Video className="h-8 w-8 text-[#F5BB07]" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[#313D6A]">{statistics?.total_videos}</div>
                    <div className="text-sm text-gray-600">Total Videos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#313D6A]/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileQuestion className="h-8 w-8 text-[#313D6A]" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[#313D6A]">{statistics?.total_quizzes}</div>
                    <div className="text-sm text-gray-600">Total Quizzes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#313D6A]/20">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Monitor className="h-8 w-8 text-[#F5BB07]" />
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[#313D6A]">{statistics?.total_live_classes}</div>
                    <div className="text-sm text-gray-600">Live Classes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <Card className="border-[#313D6A]/20">
                <CardHeader>
                  <CardTitle className="text-[#313D6A] flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Recent Videos
                  </CardTitle>
                  <CardDescription>Your latest video content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videos?.map((video) => (
                      <div
                        key={video.id}
                        className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#F5BB07]"
                        onClick={() => handleVideoClick(video.id)}
                      >
                        <div className="relative">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold text-[#313D6A] group-hover:text-[#F5BB07] transition-colors">
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                            <span>{video.duration}</span>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {video.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-[#313D6A] flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Active Courses
                  </CardTitle>
                  <CardDescription>Manage your course offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teacherData?.recent_courses?.map((course) => (
                      <div
                        key={course.id}
                        className="group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#F5BB07]"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-[#313D6A] group-hover:text-[#F5BB07] transition-colors">
                            {course.title}
                          </h4>
                          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.students} students
                            </div>
                            <span>{course.progress}% complete</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-[#F5BB07] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-[#313D6A]/20">
                <CardHeader>
                  <CardTitle className="text-[#313D6A]">Profile Summary</CardTitle>
                  <CardDescription>Your professional details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={teacherData?.profile_picture || "/placeholder.svg"} alt={teacherData?.teacher_name} />
                      <AvatarFallback className="bg-[#313D6A] text-white text-lg">
                        {teacherData?.teacher_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-[#313D6A]">{teacherData?.teacher_name}</h3>
                    <p className="text-sm text-gray-600">{teacherData?.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Experience</span>
                      <span className="text-sm text-[#313D6A] font-semibold">{teacherProfile?.experience_years} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Hourly Rate</span>
                      <span className="text-sm font-bold text-[#F5BB07]">${teacherProfile?.hourly_rate}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">Subjects</span>
                      <div className="flex flex-wrap gap-2">
                        {teacherProfile?.teaching_subjects?.map((subject) => (
                          <Badge key={subject} variant="secondary" className="bg-[#313D6A]/10 text-[#313D6A]">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold"
                    onClick={() => router.push("/profile")}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20">
                <CardHeader>
                  <CardTitle className="text-[#313D6A]">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                    onClick={() => router.push("/courses/create")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create New Course
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                    onClick={() => router.push("/videos/upload")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                    onClick={() => router.push("/live-class/schedule")}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Schedule Live Class
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function TutorDashboardPage() {
  return <TutorDashboard />
}
