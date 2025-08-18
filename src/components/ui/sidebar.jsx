"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Users, Video, FileQuestion, Monitor, Menu, X } from "lucide-react"
import { useAuth } from "@/components/auth/AuthContext"

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden text-[#313D6A] bg-white shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-[#313D6A] text-white transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Navigation</h2>
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
              onClick={() => {
                router.push(user?.role === "teacher" ? "/tutor/dashboard" : "/student/dashboard")
                setSidebarOpen(false)
              }}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => {
                router.push(user?.role === "teacher" ? "/tutor/courses" : "/courses")
                setSidebarOpen(false)
              }}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Courses
            </Button>
            {user?.role === "teacher" && <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => {
                router.push("/courses/create")
                setSidebarOpen(false)
              }}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Create Course
            </Button>}
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => {
                router.push(user?.role === "teacher" ? "/tutor/videos" : "/videos")
                setSidebarOpen(false)
              }}
            >
              <Video className="h-4 w-4 mr-3" />
              Videos
            </Button>
            {user?.role === "teacher" && <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => {
                router.push("/tutor/enrolled-students")
                setSidebarOpen(false)
              }}
            >
              <Users className="h-4 w-4 mr-3" />
              Students
            </Button>}
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => {
                router.push(user?.role === "teacher" ? "/tutor/quizzes" : "/student/quizzes")
                setSidebarOpen(false)
              }}
            >
              <FileQuestion className="h-4 w-4 mr-3" />
              Quizzes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#F5BB07] hover:text-[#313D6A] transition-colors"
              onClick={() => {
                router.push(user?.role === "teacher" ? "/tutor/live-classes" : "/student/live-classes")
                setSidebarOpen(false)
              }}
            >
              <Monitor className="h-4 w-4 mr-3" />
              Live Classes
            </Button>
          </nav>
        </div>
      </div>
    </>
  )
}
