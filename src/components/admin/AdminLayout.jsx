"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, UserCheck, CreditCard, Menu, X, LogOut, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Pending Teachers", href: "/admin/pending-teachers", icon: UserCheck },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
]

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-[#313D6A] to-[#2a3458] shadow-2xl">
          {/* Logo section with enhanced styling */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5BB07] flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-[#313D6A]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Portal</h1>
                <p className="text-xs text-slate-300">Management System</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation with improved spacing and hover effects */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#F5BB07] text-[#313D6A] shadow-lg transform scale-105"
                      : "text-slate-300 hover:bg-white/10 hover:text-white hover:transform hover:scale-105"
                  }`}
                >
                  <item.icon className={`mr-4 h-5 w-5 flex-shrink-0 ${isActive ? "text-[#313D6A]" : ""}`} />
                  {item.name}
                  {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-[#313D6A]" />}
                </Link>
              )
            })}
          </nav>

          {/* Enhanced logout section */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-slate-300 hover:bg-red-500/20 hover:text-red-300 rounded-xl py-3 transition-all duration-200"
            >
              <LogOut className="mr-4 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-10 flex h-20 items-center gap-x-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-slate-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {navigation.find((item) => item.href === pathname)?.name || "Admin Dashboard"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">Manage your platform efficiently</p>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search bar */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-slate-50 border-slate-200 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                  />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 rounded-lg">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#F5BB07] rounded-full text-xs"></span>
                </Button>

                {/* Admin avatar */}
                <Avatar className="h-10 w-10 border-2 border-[#F5BB07]">
                  <AvatarFallback className="bg-[#313D6A] text-white font-semibold">AD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 py-8">
          <div className="h-full px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 h-full">
              <div className="p-6 h-full">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export { AdminLayout }
export default AdminLayout
