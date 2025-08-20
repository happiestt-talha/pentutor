"use client"

import { useState, useEffect } from "react"
import { Filter, Grid, List, ChevronLeft, ChevronRight, Star, Clock, Users, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import OurCoursesImage from "@/assets/images/our-courses/our-courses-hero.png"
import Image from "next/image"

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

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCourses()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFfff" }}>
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold" style={{ color: "#313D6A" }}>
                  🖊️ PEN TUTOR
                </span>
              </div>
            </div>

            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  About Us
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Our Services
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Courses
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Our Tutors
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Job Board
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Blog
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Contact Us
                </a>
              </div>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" style={{ borderColor: "#313D6A", color: "#313D6A" }}>
                Login
              </Button>
              <Button style={{ backgroundColor: "#313D6A", color: "white" }}>Register</Button>
            </div>
          </div>
        </div>
      </header> */}

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#313D6A]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#313D6A" }}>
                Search Online Courses
                <br />
                of Your Choice
              </h1>

              <div className="relative max-w-2xl">
                <div className="rounded-full p-6 shadow-lg" style={{ backgroundColor: "#F5BB07" }}>
                  <form onSubmit={handleSearch} className="flex gap-4">
                    <Input
                      placeholder="Enter Your Required Course"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 rounded-full border-0 bg-white px-6 py-3 text-lg"
                    />
                    <Button
                      type="submit"
                      className="rounded-full px-8 py-3 text-lg font-semibold"
                      style={{ backgroundColor: "#313D6A", color: "white" }}
                    >
                      Search
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <Image
                src={OurCoursesImage}
                width={500}
                height={500}
                alt="Person learning online"
                className="max-w-md w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
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

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{totalCourses} courses available</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                style={viewMode === "grid" ? { backgroundColor: "#313D6A" } : {}}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                style={viewMode === "list" ? { backgroundColor: "#313D6A" } : {}}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="px-4 sm:px-6 lg:px-8 py-8" style={{ backgroundColor: "#FFFfff" }}>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 group bg-white rounded-lg overflow-hidden"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnail || "/placeholder.svg?height=200&width=350&query=online course thumbnail"}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge
                          className="text-xs px-2 py-1 rounded-full text-white font-medium"
                          style={{
                            backgroundColor: course.teacher?.expertise_areas?.[0] === "Maths" ? "#4CAF50" : "#2196F3",
                          }}
                        >
                          {course.teacher?.expertise_areas?.[0] || "General"}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: course.course_type === "free" ? "#4CAF50" : "#F5BB07",
                            color: course.course_type === "free" ? "white" : "#313D6A",
                          }}
                        >
                          {course.course_type === "free" ? "Free" : `${course.price} PKR`}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3
                        className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
                        style={{ color: "#313D6A" }}
                      >
                        {course.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                          <span className="text-gray-400">(579)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.total_enrollments || 770} Students</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>1 hr 45 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          <span>46 Lectures</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              course.teacher?.profile_picture ||
                              "/placeholder.svg?height=32&width=32&query=teacher profile"
                            }
                            alt={course.teacher?.first_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium" style={{ color: "#313D6A" }}>
                            {course.teacher?.first_name} {course.teacher?.last_name}
                          </span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: "#F5BB07" }}>
                          {course.course_type === "free" ? "FREE" : `${course.price} PKR`}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-full w-12 h-12 p-0"
                    style={{ backgroundColor: "#F5BB07", borderColor: "#F5BB07", color: "#313D6A" }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="rounded-full w-12 h-12 p-0 text-lg font-semibold"
                          style={
                            currentPage === pageNum
                              ? { backgroundColor: "#313D6A", color: "white" }
                              : { backgroundColor: "white", borderColor: "#313D6A", color: "#313D6A" }
                          }
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
                    className="rounded-full w-12 h-12 p-0"
                    style={{ backgroundColor: "#F5BB07", borderColor: "#F5BB07", color: "#313D6A" }}
                  >
                    <ChevronRight className="h-5 w-5" />
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
