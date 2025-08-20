"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  BookOpen,
  Calendar,
  Users,
  Video,
  FileQuestion,
  Monitor,
  Menu,
  X,
  GraduationCap,
  User,
  Bell,
  FlaskConical,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/components/auth/AuthContext"


function TutorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [teacherData, setTeacherData] = useState(null)
  const [teacherProfile, setTeacherProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, logout } = useAuth()

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const teacherResponse = await axios.get(`${API_BASE}/api/teacher/`, {
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

    fetchData()
  }, [])

  const handleVideoClick = (videoId) => {
    router.push(`/tutor/videos/${videoId}`)
  }

  const handleCourseClick = (courseId) => {
    router.push(`/courses/details/${courseId}`)
  }

  const handleLogout = async () => {
    try {
      logout()
      router.push("/")
    } catch (error) {
      toast.error("Failed to logout.")
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#313D6A] mx-auto mb-4"></div>
          <p className="text-[#313D6A]">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFCE0]">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A]"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const { teacher, statistics, videos, courses } = teacherData

  const upcomingSessions = [
    {
      id: 1,
      studentId: "PTS100",
      studentName: "Muhammad Ahmad",
      classLevel: "O Level 1",
      subject: "Chemistry",
      dateTime: "Monday 17:00 PM-18:00 PM",
      timings: "Tuesday 17:00 PM-18:00 PM",
      mode: "Online",
      status: "Confirmed",
    },
    {
      id: 2,
      studentId: "PTS200",
      studentName: "Sarah Khan",
      classLevel: "A Level 2",
      subject: "Physics",
      dateTime: "Tuesday 15:00 PM-16:00 PM",
      timings: "Wednesday 15:00 PM-16:00 PM",
      mode: "Home",
      status: "Pending",
    },
  ]

  const scheduledClasses = {
    homeTuitions: [
      {
        id: 1,
        studentId: "PTS100",
        studentName: "Muhammad Ahmad",
        classLevel: "O Level 1",
        subject: "Chemistry",
        daysTime: "Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM",
        location: "Street No 6, DHA Phase 5, Lahore",
      },
    ],
    onlineTuitions: [
      {
        id: 1,
        studentId: "PTS100",
        studentName: "Muhammad Ahmad",
        classLevel: "O Level 1",
        subject: "Chemistry",
        daysTime: "Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM",
      },
    ],
    onlineGroupSessions: [
      {
        id: 1,
        studentId: "PTS100",
        studentName: "Muhammad Ahmad",
        classLevel: "O Level 1",
        subject: "Chemistry",
        daysTime: "Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM",
      },
    ],
  }

  const videoCourses = [
    { id: 1, title: "O Level Chemistry", color: "bg-[#F5BB07]" },
    { id: 2, title: "O Level Physics", color: "bg-cyan-400" },
    { id: 3, title: "O Level Computer", color: "bg-pink-500" },
  ]

  const onlineResources = [
    { id: 1, title: "Key Book", color: "bg-[#F5BB07]" },
    { id: 2, title: "Past Papers", color: "bg-cyan-400" },
    { id: 3, title: "Important Notes", color: "bg-pink-500" },
  ]

  const recentJobs = [
    "O/A Levels Tutors Required",
    "O/A Levels Tutors Required",
    "O/A Levels Tutors Required",
    "O/A Levels Tutors Required",
  ]

  const notices = ["Notice No. 1", "Notice No. 2", "Notice No. 3", "Notice No. 4"]

  const attendanceData = [
    { code: "PTS-100", classes: "1 Class" },
    { code: "PTS-200", classes: "2 Classes" },
    { code: "PTS-300", classes: "3 Classes" },
  ]

  const notifications = [
    {
      id: 1,
      title: "New Student Request",
      message: "Muhammad Ahmad has requested Chemistry tutoring",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment Received",
      message: "Payment of 1500 RS received from Sarah Khan",
      time: "4 hours ago",
      unread: true,
    },
    {
      id: 3,
      title: "Class Reminder",
      message: "You have a Physics class at 3:00 PM today",
      time: "6 hours ago",
      unread: false,
    },
    {
      id: 4,
      title: "Profile Update",
      message: "Your profile has been successfully updated",
      time: "1 day ago",
      unread: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-[#313D6A] text-white transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="bg-[#313D6A] rounded-lg p-4 mb-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`${API_BASE}${teacherData?.profile_picture}` || "/placeholder.svg"} alt={teacherData?.teacher_name} />
                <AvatarFallback className="bg-[#F5BB07] text-[#313D6A] text-lg font-bold">
                  {teacherData?.teacher_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{teacherData?.teacher_name || ""}</h3>
                <p className="text-[#F5BB07] text-sm font-medium">Level 2</p>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10 mb-4"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <nav className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors bg-[#F5BB07] text-[#313D6A]"
              onClick={() => router.push("/tutor-dashboard")}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/profile")}
            >
              <User className="h-4 w-4 mr-3" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/agreement")}
            >
              <FileQuestion className="h-4 w-4 mr-3" />
              Agreement
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/class-schedule")}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Class Schedule
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/payment-record")}
            >
              <Monitor className="h-4 w-4 mr-3" />
              Record of Payment
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/courses")}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Courses of Material
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/job-board")}
            >
              <Users className="h-4 w-4 mr-3" />
              Job Board
            </Button>
            {/* <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/student-request")}
            >
              <GraduationCap className="h-4 w-4 mr-3" />
              Student Request
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/featured")}
            >
              <Video className="h-4 w-4 mr-3" />
              Become Featured Tutors
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => router.push("/tutor/affiliate")}
            >
              <Users className="h-4 w-4 mr-3" />
              Become Pentutor Affiliate
            </Button> */}
            <Button
              variant="ghost"
              className="w-full justify-start text-white cursor-pointer bg-destructive/30 border border-destructive hover:bg-destructive hover:text-white transition-colors"
              onClick={() => handleLogout()}
            >
              <X className="h-4 w-4 mr-3" />
              Logout
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
                <h1 className="text-2xl sm:text-3xl font-bold text-[#313D6A]">Welcome To Tutor Dashboard</h1>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span className="mr-4">Member Since</span>
                  <span className="text-gray-400">5 July 2021</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[#313D6A]">Notifications</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${notification.unread ? "bg-[#F5BB07]/10 border-[#F5BB07]/30" : "bg-gray-50 border-gray-200"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#313D6A] text-sm">{notification.title}</h4>
                            <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                            <span className="text-gray-400 text-xs">{notification.time}</span>
                          </div>
                          {notification.unread && <div className="w-2 h-2 bg-[#F5BB07] rounded-full mt-1"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      variant="link"
                      className="text-[#313D6A] hover:text-[#F5BB07] text-sm"
                      onClick={() => setNotificationOpen(false)}
                    >
                      Mark all as read
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="bg-[#313D6A] text-white rounded-t-lg">
                  <CardTitle className="text-white text-lg font-bold">Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#313D6A] text-white text-sm font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left border-r border-white/20">Student ID</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Class/Level</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Subject</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Date/day</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Timings</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Mode</th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingSessions.map((session, index) => (
                          <tr key={session.id} className={index % 2 === 0 ? "bg-[#313D6A]/5" : "bg-white"}>
                            <td className="px-4 py-3 text-sm border-r border-gray-200">
                              <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                              <div className="text-xs text-gray-500">{session.studentName}</div>
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                              {session.classLevel}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                              {session.subject}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700">
                              {session.dateTime}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700">
                              {session.timings}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                              {session.mode}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge
                                variant={session.status === "Confirmed" ? "default" : "secondary"}
                                className={
                                  session.status === "Confirmed"
                                    ? "bg-[#F5BB07] text-[#313D6A] font-medium"
                                    : "bg-orange-500 text-white font-medium"
                                }
                              >
                                {session.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#313D6A]">My Scheduled Classes</h2>

                <Card className="border-[#313D6A]/20 shadow-lg">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="text-[#313D6A] font-bold">My Scheduled Home Tuitions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#F5BB07] text-[#313D6A] text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Student ID</th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Class/Level</th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Subject</th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Days & Timing</th>
                            <th className="px-4 py-3 text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledClasses.homeTuitions.map((session, index) => (
                            <tr key={session.id} className="bg-[#F5BB07]/10">
                              <td className="px-4 py-3 text-sm border-r border-gray-200">
                                <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                                <div className="text-xs text-gray-600">{session.studentName}</div>
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.classLevel}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.subject}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700">
                                {session.daysTime}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{session.location}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#313D6A]/20 shadow-lg">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="text-[#313D6A] font-bold">My Scheduled Online Tuitions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-cyan-400 text-white text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-white/20">Student ID</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Class/Level</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Subject</th>
                            <th className="px-4 py-3 text-left">Days & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledClasses.onlineTuitions.map((session, index) => (
                            <tr key={session.id} className="bg-cyan-50">
                              <td className="px-4 py-3 text-sm border-r border-gray-200">
                                <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                                <div className="text-xs text-gray-600">{session.studentName}</div>
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.classLevel}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.subject}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{session.daysTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#313D6A]/20 shadow-lg">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="text-[#313D6A] font-bold">My Scheduled Online Group Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-pink-500 text-white text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-white/20">Student ID</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Class/Level</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Subject</th>
                            <th className="px-4 py-3 text-left">Days & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledClasses.onlineGroupSessions.map((session, index) => (
                            <tr key={session.id} className="bg-pink-50">
                              <td className="px-4 py-3 text-sm border-r border-gray-200">
                                <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                                <div className="text-xs text-gray-600">{session.studentName}</div>
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.classLevel}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.subject}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{session.daysTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#313D6A]">My Video Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {videoCourses.map((course) => (
                    <Card
                      key={course.id}
                      className={`${course.color} text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                            <FlaskConical className="h-8 w-8" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{course.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#313D6A]">My Online Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {onlineResources.map((resource) => (
                    <Card
                      key={resource.id}
                      className={`${resource.color} text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{resource.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#F5BB07]/10 to-[#F5BB07]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#F5BB07] text-lg font-bold">Recent Jobs</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentJobs.map((job, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-lg hover:bg-[#F5BB07]/10 transition-colors cursor-pointer"
                    >
                      - {job}
                    </div>
                  ))}
                  <Button variant="link" className="text-[#F5BB07] text-sm p-0 h-auto font-medium">
                    View All Jobs
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Notice Board</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notices.map((notice, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-lg hover:bg-[#313D6A]/10 transition-colors cursor-pointer"
                    >
                      - {notice}
                    </div>
                  ))}
                  <Button variant="link" className="text-[#F5BB07] text-sm p-0 h-auto font-medium">
                    View All Notices
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Payments</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-600 text-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Received Payment:</span>
                      <span className="font-bold text-lg">1500 RS</span>
                    </div>
                  </div>
                  <div className="bg-pink-500 text-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Payment:</span>
                      <span className="font-bold text-lg">2500 RS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Attendance</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attendanceData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700 font-medium">{item.code}</span>
                      <span className="text-[#313D6A] font-bold">{item.classes}</span>
                    </div>
                  ))}
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
