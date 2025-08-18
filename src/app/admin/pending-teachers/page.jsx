"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Check, X, Clock } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

export default function PendingTeachers() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const router = useRouter()

  useEffect(() => {
    fetchPendingProfiles()
  }, [])

  const fetchPendingProfiles = async () => {
    try {
      const response = await api.get("/api/admin-portal/pending-profiles/")
      setProfiles(response.data.profiles)
    } catch (error) {
      console.error("Error fetching pending profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewProfile = async (profileId, action) => {
    console.log(profileId, action)
    setActionLoading((prev) => ({ ...prev, [profileId]: true }))

    try {
      await api.put("/api/admin-portal/review-profile/", {
        action,
        profile_type: "teacher",
        profile_id: profileId,
      })

      // Remove the profile from the list after action
      setProfiles((prev) => prev.filter((p) => p.profile_id !== profileId))
    } catch (error) {
      console.error("Error reviewing profile:", error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [profileId]: false }))
    }
  }

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pending Teacher Profiles</h1>
        <Badge className="text-lg px-3 py-1" style={{ backgroundColor: "#F5BB07", color: "white" }}>
          {profiles.length} Pending
        </Badge>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 mr-2" style={{ color: "#F5BB07" }} />
                <span className="text-3xl font-bold" style={{ color: "#313D6A" }}>
                  {profiles.length}
                </span>
              </div>
              <p className="text-gray-600">Teacher profiles awaiting review</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Profiles */}
      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.profile_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {profile.user.first_name} {profile.user.last_name}
                  </CardTitle>
                  <Badge style={{ backgroundColor: "#F5BB07", color: "white" }}>{profile.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* User Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Username:</span>
                    <span className="text-sm text-gray-900">@{profile.user.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <span className="text-sm text-gray-900">{profile.user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Current Role:</span>
                    <Badge variant="outline">{profile.user.role}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Verified:</span>
                    <Badge variant={profile.user.is_verified ? "default" : "secondary"}>
                      {profile.user.is_verified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {profile.user.age && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Age:</span>
                      <span className="text-sm text-gray-900">{profile.user.age}</span>
                    </div>
                  )}
                  {profile.user.city && profile.user.country && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Location:</span>
                      <span className="text-sm text-gray-900">
                        {profile.user.city}, {profile.user.country}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Applied:</span>
                    <span className="text-sm text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    // onClick={() => router.push(`/admin/teacher-profile/${profile.user.id}`)}
                    onClick={() => console.log(profile.user.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleReviewProfile(profile.profile_id, "approve")}
                    disabled={actionLoading[profile.profile_id]}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReviewProfile(profile.profile_id, "reject")}
                    disabled={actionLoading[profile.profile_id]}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>

                {actionLoading[profile.profile_id] && (
                  <div className="mt-3 flex items-center justify-center">
                    <div
                      className="animate-spin rounded-full h-4 w-4 border-b-2"
                      style={{ borderColor: "#313D6A" }}
                    ></div>
                    <span className="ml-2 text-sm text-gray-600">Processing...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center">
              <Check className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-500">No pending teacher profiles to review at the moment.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
