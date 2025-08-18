"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Bell,
  Star,
  Clock,
  User,
  Play,
  CheckCircle,
  Trash2,
  BookMarkedIcon as MarkAsRead,
  Eye,
} from "lucide-react"
import { Sidebar } from "@/components/ui/sidebar"

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notificationStats, setNotificationStats] = useState({ unread_count: 0, total_count: 0 })
  const [loading, setLoading] = useState(true)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  useEffect(() => {
    fetchStudentData()
    fetchEnrolledCourses()
    fetchNotificationStats()
  }, [])

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students/`)
      if (response.data.success) {
        setStudentData(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students/courses/`)
      if (response.data.success) {
        setEnrolledCourses(response.data.data.courses)
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    setNotificationsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/`)
      setNotifications(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setNotificationsLoading(false)
    }
  }

  const fetchNotificationStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/stats/`)  
      setNotificationStats(response.data)
    } catch (error) {
      console.error("Error fetching notification stats:", error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/mark-as-read/`, { notification_id: notificationId })
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
      )
      fetchNotificationStats()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/mark-all-as-read/`)
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
      fetchNotificationStats()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}/delete/`)
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
      fetchNotificationStats()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const deleteAllRead = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/delete-all-read/`)
      setNotifications((prev) => prev.filter((notif) => !notif.is_read))
      fetchNotificationStats()
    } catch (error) {
      console.error("Error deleting read notifications:", error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "video_upload":
        return <Play className="h-4 w-4" />
      case "quiz":
        return <CheckCircle className="h-4 w-4" />
      case "meeting":
        return <Clock className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-64">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <h1 className="text-2xl font-bold text-[#313D6A]">Student Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications Modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="relative bg-transparent" onClick={fetchNotifications}>
                    <Bell className="h-4 w-4" />
                    {notificationStats.unread_count > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                        {notificationStats.unread_count}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>Notifications</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                          <MarkAsRead className="h-4 w-4 mr-2" />
                          Mark All Read
                        </Button>
                        <Button variant="outline" size="sm" onClick={deleteAllRead}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Read
                        </Button>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">Unread</TabsTrigger>
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                      <ScrollArea className="h-96">
                        {notificationsLoading ? (
                          <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="animate-pulse p-4 border rounded-lg">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border rounded-lg ${
                                  notification.is_read ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div
                                      className={`p-2 rounded-full ${
                                        notification.is_read ? "bg-gray-200" : "bg-blue-100"
                                      }`}
                                    >
                                      {getNotificationIcon(notification.notification_type)}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">{notification.title}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                        <span>{notification.time_since_created}</span>
                                        {notification.course && (
                                          <Badge variant="outline" className="text-xs">
                                            {notification.course.title}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    {!notification.is_read && (
                                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteNotification(notification.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="unread">
                      <ScrollArea className="h-96">
                        <div className="space-y-2">
                          {notifications
                            .filter((n) => !n.is_read)
                            .map((notification) => (
                              <div key={notification.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className="p-2 rounded-full bg-blue-100">
                                      {getNotificationIcon(notification.notification_type)}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">{notification.title}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                      <span className="text-xs text-gray-500">{notification.time_since_created}</span>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="recent">
                      <ScrollArea className="h-96">
                        <div className="space-y-2">
                          {notifications.slice(0, 10).map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border rounded-lg ${
                                notification.is_read ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`p-2 rounded-full ${notification.is_read ? "bg-gray-200" : "bg-blue-100"}`}
                                >
                                  {getNotificationIcon(notification.notification_type)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <span className="text-xs text-gray-500">{notification.time_since_created}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={studentData?.profile_picture || "/placeholder.svg"}
                    alt={studentData?.student_name}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{studentData?.student_name}</p>
                  <p className="text-xs text-gray-500">{studentData?.student_email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-[#313D6A]">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                    <p className="text-3xl font-bold text-[#313D6A]">
                      {studentData?.statistics.total_enrollments || 0}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-[#313D6A]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                    <p className="text-3xl font-bold text-green-600">
                      {studentData?.statistics.completed_courses || 0}
                    </p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#F5BB07]">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-3xl font-bold text-[#F5BB07]">
                      {studentData?.statistics.in_progress_courses || 0}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#F5BB07]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-blue-600">${studentData?.statistics.total_spent || 0}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrolled Courses Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#313D6A]">My Enrolled Courses</CardTitle>
                  <CardDescription>Continue your learning journey with your enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
                      <p className="text-gray-500 mb-4">Start your learning journey by enrolling in a course</p>
                      <Button onClick={() => router.push("/courses")} className="bg-[#313D6A] hover:bg-[#313D6A]/90">
                        Browse Courses
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {enrolledCourses.map((enrollment) => (
                        <div
                          key={enrollment.enrollment_id}
                          className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => router.push(`/courses/detail/${enrollment.course.id}`)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-[#313D6A] mb-2">{enrollment.course.title}</h3>
                              <p className="text-gray-600 text-sm mb-3">{enrollment.course.description}</p>

                              {/* Teacher Info */}
                              <div className="flex items-center space-x-3 mb-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={enrollment.course.teacher.profile_picture || "/placeholder.svg"}
                                    alt={`${enrollment.course.teacher.first_name} ${enrollment.course.teacher.last_name}`}
                                  />
                                  <AvatarFallback>
                                    {enrollment.course.teacher.first_name[0]}
                                    {enrollment.course.teacher.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">
                                    {enrollment.course.teacher.first_name} {enrollment.course.teacher.last_name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {enrollment.course.teacher.expertise_areas.join(", ")}
                                  </p>
                                </div>
                              </div>

                              {/* Course Stats */}
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <Play className="h-4 w-4 mr-1" />
                                  {enrollment.course.total_videos} videos
                                </span>
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {enrollment.course.total_enrollments} students
                                </span>
                                {enrollment.course.reviews.length > 0 && (
                                  <span className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                                    {(
                                      enrollment.course.reviews.reduce((acc, review) => acc + review.rating, 0) /
                                      enrollment.course.reviews.length
                                    ).toFixed(1)}
                                  </span>
                                )}
                              </div>

                              {/* Progress Bar */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-medium">{enrollment.progress_percentage}%</span>
                                </div>
                                <Progress value={enrollment.progress_percentage} className="h-2" />
                                <p className="text-xs text-gray-500 mt-1">
                                  {enrollment.completed_items} of {enrollment.total_items} items completed
                                </p>
                              </div>

                              {/* Badges */}
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={enrollment.course.course_type === "free" ? "secondary" : "default"}
                                  className={
                                    enrollment.course.course_type === "free" ? "bg-green-100 text-green-800" : ""
                                  }
                                >
                                  {enrollment.course.course_type}
                                </Badge>
                                <Badge
                                  variant={enrollment.is_completed ? "default" : "outline"}
                                  className={
                                    enrollment.is_completed ? "bg-green-500" : "border-[#F5BB07] text-[#F5BB07]"
                                  }
                                >
                                  {enrollment.is_completed ? "Completed" : "In Progress"}
                                </Badge>
                                <Badge variant="outline">{enrollment.payment_status}</Badge>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold text-[#313D6A]">${enrollment.course.price}</p>
                              <p className="text-xs text-gray-500">
                                Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Student Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#313D6A]">My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage
                        src={`${API_BASE_URL}${studentData?.profile_picture || "/placeholder.svg"}`}
                        alt={studentData?.student_name}
                      />
                      <AvatarFallback className="text-lg">{studentData?.student_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg text-[#313D6A]">{studentData?.student_name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{studentData?.student_email}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Courses Enrolled:</span>
                        <span className="font-medium">{studentData?.statistics.total_enrollments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium text-green-600">{studentData?.statistics.completed_courses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">In Progress:</span>
                        <span className="font-medium text-[#F5BB07]">
                          {studentData?.statistics.in_progress_courses}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#313D6A]">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-[#313D6A] hover:bg-[#313D6A]/90" onClick={() => router.push("/courses")}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse All Courses
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#F5BB07] text-[#F5BB07] hover:bg-[#F5BB07] hover:text-white bg-transparent"
                    onClick={() => router.push("/student/profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {studentData?.recent_enrollments && studentData.recent_enrollments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#313D6A]">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {studentData.recent_enrollments.slice(0, 3).map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-[#313D6A] rounded-full">
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{enrollment.course.title}</p>
                            <p className="text-xs text-gray-500">
                              Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
