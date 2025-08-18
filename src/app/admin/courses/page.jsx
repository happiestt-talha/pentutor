"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Eye, Users, Video, BookOpen } from "lucide-react"
import api from "@/lib/api"

export default function Courses() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/admin-portal/teachers-courses")
      setTeachers(response.data.data.teachers)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const allCourses = teachers.flatMap((teacher) =>
    teacher.courses.course_list.map((course) => ({
      ...course,
      teacherInfo: {
        username: teacher.username,
        email: teacher.email,
        bio: teacher.bio,
        is_verified: teacher.is_verified,
      },
    })),
  )

  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${course.teacher.first_name} ${course.teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalCourses = teachers.reduce((sum, teacher) => sum + teacher.courses.total_courses, 0)
  const activeCourses = teachers.reduce((sum, teacher) => sum + teacher.courses.active_courses, 0)
  const paidCourses = teachers.reduce((sum, teacher) => sum + teacher.courses.paid_courses, 0)
  const totalEnrollments = allCourses.reduce((sum, course) => sum + course.total_enrollments, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#313D6A" }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#313D6A" }}>
                {totalCourses}
              </p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{activeCourses}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "#F5BB07" }}>
                {paidCourses}
              </p>
              <p className="text-sm text-gray-600">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{totalEnrollments}</p>
              <p className="text-sm text-gray-600">Total Enrollments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers and Courses */}
      <div className="space-y-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden">
            <CardHeader style={{ backgroundColor: "#313D6A" }} className="text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white">
                    {teacher.username}
                    {teacher.is_verified && <Badge className="ml-2 bg-green-500 text-white">Verified</Badge>}
                  </CardTitle>
                  <p className="text-gray-200">{teacher.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{teacher.courses.total_courses}</p>
                  <p className="text-sm text-gray-200">Courses</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {teacher.courses.course_list.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teacher.courses.course_list.map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <Badge
                            style={{
                              backgroundColor: course.course_type === "free" ? "#10B981" : "#F5BB07",
                              color: "white",
                            }}
                          >
                            {course.course_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{course.description}</p>

                        {/* Teacher Expertise */}
                        {course.teacher.expertise_areas && course.teacher.expertise_areas.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-700 mb-2">Expertise:</p>
                            <div className="flex flex-wrap gap-1">
                              {course.teacher.expertise_areas.slice(0, 3).map((area, index) => (
                                <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Course Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.total_enrollments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            <span>{course.total_videos}</span>
                          </div>
                          <Badge variant={course.is_active ? "default" : "secondary"} className="text-xs">
                            {course.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold" style={{ color: "#313D6A" }}>
                              ${course.price}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(course.created_at).toLocaleDateString()}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No courses created yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {teachers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No teachers or courses found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
