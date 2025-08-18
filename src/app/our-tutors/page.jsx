"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Star, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"

export default function OurTutorPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
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

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/courses/teachers/`)

      if (response.data.success) {
        setTeachers(response.data.data || [])
      } else {
        throw new Error("Failed to fetch teachers")
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to load tutors")
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.expertise_areas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      teacher.course_categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (isAdmin &&
        (teacher.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.last_name.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesCategory =
      filterCategory === "all" ||
      teacher.course_categories.some((category) => category.toLowerCase() === filterCategory.toLowerCase())

    return matchesSearch && matchesCategory
  })

  const handleTutorClick = (tutorId) => {
    router.push(`/our-tutors/tutor/${tutorId}`)
  }

  const getDisplayName = (teacher) => {
    if (isAdmin) {
      return `${teacher.first_name} ${teacher.last_name}`
    }
    return `Teacher #${teacher.id}`
  }

  const getAvailableDays = (schedule) => {
    return Object.keys(schedule).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#313D6A]">Our Tutors</h1>
              <p className="text-gray-600 mt-1">{filteredTeachers.length} expert tutors available</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by expertise, subjects, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="data science">Data Science</SelectItem>
                  <SelectItem value="web development">Web Development</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No tutors found</div>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-gray-200 hover:border-[#F5BB07]"
                  onClick={() => handleTutorClick(teacher.id)}
                >
                  <CardContent className="p-6">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={teacher.profile_picture || "/placeholder.svg"}
                          alt={getDisplayName(teacher)}
                        />
                        <AvatarFallback className="bg-[#313D6A] text-white text-lg">
                          {isAdmin ? `${teacher.first_name[0]}${teacher.last_name[0]}` : `T${teacher.id}`}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#313D6A] group-hover:text-[#F5BB07] transition-colors truncate">
                          {getDisplayName(teacher)}
                        </h3>
                        {isAdmin && <p className="text-sm text-gray-600 truncate">@{teacher.username}</p>}
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {teacher.bio ||
                        "Experienced educator passionate about teaching and helping students achieve their goals."}
                    </p>

                    {/* Expertise Areas */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-[#313D6A] mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-1">
                        {teacher.expertise_areas.slice(0, 3).map((area, index) => (
                          <Badge key={index} variant="secondary" className="bg-[#313D6A]/10 text-[#313D6A] text-xs">
                            {area}
                          </Badge>
                        ))}
                        {teacher.expertise_areas.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                            +{teacher.expertise_areas.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Course Categories */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-[#313D6A] mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-1">
                        {teacher.course_categories.slice(0, 2).map((category, index) => (
                          <Badge key={index} className="bg-[#F5BB07]/20 text-[#313D6A] text-xs">
                            {category}
                          </Badge>
                        ))}
                        {teacher.course_categories.length > 2 && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                            +{teacher.course_categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>150+ students</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{getAvailableDays(teacher.availability_schedule)} days</span>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Languages:</span>
                        <span>{teacher.languages_spoken.join(", ")}</span>
                      </div>
                    </div>

                    {/* Teaching Methods */}
                    <div className="flex flex-wrap gap-1">
                      {teacher.preferred_teaching_methods.map((method, index) => (
                        <Badge key={index} variant="outline" className="border-[#313D6A]/30 text-[#313D6A] text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>

                    {/* View Profile Button */}
                    <Button
                      className="w-full mt-4 bg-[#313D6A] hover:bg-[#313D6A]/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTutorClick(teacher.id)
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
