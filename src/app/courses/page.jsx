"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCourses, setTotalCourses] = useState(0)
  const coursesPerPage = 12

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

  const fetchCourses = async () => {
    try {
      setLoading(true)

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: coursesPerPage.toString(),
        search: searchQuery,
        sortBy: sortBy,
        type: filterType !== "all" ? filterType : "",
      })

      // Remove empty parameters
      Array.from(params.entries()).forEach(([key, value]) => {
        if (!value) params.delete(key)
      })

      const response = await axios.get(`${API_BASE}/api/courses/?${params.toString()}`)
      console.log("Courses Response:", response.data)

      if (response.status === 200) {
        setCourses(response.data.results || [])
        setTotalCourses(response.data.count || 0)
        setTotalPages(Math.ceil((response.data.count || 0) / coursesPerPage))

        console.log("============================================")
        courses.map((course) => console.log(course))
        console.log("============================================")
      } else {
        throw new Error("Failed to fetch courses")
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load courses")
      setCourses([])
      setTotalCourses(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [currentPage, searchQuery, sortBy, filterType])

  const handleCourseClick = (courseId) => {
    router.push(`/courses/details/${courseId}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#313D6A]">All Courses</h1>
              <p className="text-gray-600 mt-1">{totalCourses} courses available</p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="bg-[#313D6A] hover:bg-[#313D6A]/90"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="bg-[#313D6A] hover:bg-[#313D6A]/90"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses, subjects, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Course Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No courses found</div>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <div className="relative">
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={course.courseType === "free" ? "secondary" : "default"}
                            className={
                              course.courseType === "free" ? "bg-green-100 text-green-800" : "bg-[#F5BB07] text-white"
                            }
                          >
                            {course.courseType === "free" ? "Free" : course.price}
                          </Badge>
                        </div>
                        {course.has_live_classes && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-red-500 text-white">Live Classes</Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-[#313D6A] mb-2 group-hover:text-[#F5BB07] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <span>Teacher: {course.teacher.id}</span>
                          {/* <span>Duration: {course.duration}</span> */}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-medium">{course.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">{course.total_enrollments} students</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <Card
                      key={course.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <img
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full md:w-48 h-32 object-cover rounded-lg"
                          />

                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <h3 className="text-xl font-semibold text-[#313D6A] hover:text-[#F5BB07] transition-colors">
                                {course.title}
                              </h3>
                              <div className="flex gap-2">
                                <Badge
                                  variant={course.course_type === "free" ? "secondary" : "default"}
                                  className={
                                    course.course_type === "free"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-[#F5BB07] text-black"
                                  }
                                >
                                  {course.course_type === "free" ? "Free" : course.price}
                                </Badge>
                                {course.hasLiveClasses && <Badge className="bg-red-500 text-white">Live Classes</Badge>}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3">{course.description}</p>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span>Teacher: {course.teacher.id}</span>
                                {/* <span>{course.duration}</span> */}
                                <span>{course.subject}</span>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="font-medium">{course.rating}</span>
                                </div>
                                <span>{course.total_enrollments} students</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={currentPage === pageNum ? "bg-[#313D6A] hover:bg-[#313D6A]/90" : ""}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
