"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, CreditCard, TrendingUp } from "lucide-react"
import api from "@/lib/api"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/admin-portal/overview")
      console.log("response", response)
      setData(response.data.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#313D6A" }}></div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Users",
      value: data?.user_statistics?.total_users || 0,
      icon: Users,
      color: "#313D6A",
    },
    {
      title: "Total Courses",
      value: data?.course_statistics?.total_courses || 0,
      icon: BookOpen,
      color: "#F5BB07",
    },
    {
      title: "Total Revenue",
      value: `$${data?.payment_statistics?.total_revenue || 0}`,
      icon: CreditCard,
      color: "#10B981",
    },
    {
      title: "Active Courses",
      value: data?.course_statistics?.active_courses || 0,
      icon: TrendingUp,
      color: "#8B5CF6",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Role Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#313D6A" }}>
                {data?.user_statistics?.total_students || 0}
              </p>
              <p className="text-sm text-gray-600">Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#F5BB07" }}>
                {data?.user_statistics?.total_teachers || 0}
              </p>
              <p className="text-sm text-gray-600">Teachers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{data?.user_statistics?.total_admins || 0}</p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{data?.user_statistics?.total_subadmins || 0}</p>
              <p className="text-sm text-gray-600">Sub Admins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{data?.user_statistics?.total_users || 0}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recent_activity?.recent_users?.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.first_name} {user.last_name} ({user.username})
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: user.role === "admin" ? "#313D6A" : "#F5BB07",
                      color: "white",
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recent_activity?.recent_courses?.slice(0, 5).map((course) => (
                <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: course.course_type === "free" ? "#10B981" : "#F5BB07",
                        color: "white",
                      }}
                    >
                      {course.course_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      By: {course.teacher.first_name} {course.teacher.last_name}
                    </span>
                    <span>{course.total_enrollments} enrollments</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
