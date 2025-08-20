"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import TutorSidebar from "@/components/tutor-sidebar";
import axios from "axios";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Globe,
  Clock,
  Star,
  Users,
  BookOpen,
  Edit,
  ExternalLink,
  Languages,
  Briefcase,
} from "lucide-react";

export default function TutorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // support either env var name you used before, fallback to localhost
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        // read token only in browser runtime
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(`${API_BASE}/api/auth/profile/update/`, {
          headers,
        });

        // axios doesn't have response.ok; check status
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Failed to fetch profile (status ${response.status})`);
        }

        // support both shapes: { data: { ... } } or direct payload
        const payload = response.data?.data ?? response.data;
        if (isMounted) setProfile(payload);
      } catch (err) {
        console.error("Tutor profile fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [API_BASE]);

  if (loading) {
    return (
      <div className="flex h-screen">
        {/* <TutorSidebar /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#313D6A] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen">
        {/* <TutorSidebar /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error || "Profile not found"}</p>
            <Button onClick={() => (typeof window !== "undefined" ? window.location.reload() : null)}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const safe = (v, fallback = "—") => (v === null || v === undefined || v === "" ? fallback : v);

  const formatTeachingMethod = (method = "") => {
    return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatCourseCategory = (category = "") => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const profilePictureSrc =
    profile?.profile_picture && profile.profile_picture.startsWith("http")
      ? profile.profile_picture
      : profile?.profile_picture
      ? `${API_BASE}${profile.profile_picture}`
      : "/placeholder.svg?height=128&width=128&text=Profile";

  const expertiseAreas = profile?.expertise_areas ?? [];
  const certifications = profile?.certifications ?? [];
  const education = profile?.education ?? [];
  const languagesSpoken = profile?.languages_spoken ?? [];
  const preferredTeachingMethods = profile?.preferred_teaching_methods ?? [];
  const courseCategories = profile?.course_categories ?? [];
  const availabilitySchedule = profile?.availability_schedule ?? {};
  const userVerified = profile?.user?.is_verified ?? false;
  const averageRating =
    profile?.average_rating !== undefined && profile.average_rating !== null
      ? Number(profile.average_rating)
      : null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <TutorSidebar /> */}

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#313D6A]">Tutor Profile</h1>
                <p className="text-gray-600 mt-1">Manage your professional information</p>
              </div>
              <Button className="bg-[#F5BB07] hover:bg-[#E5A906] text-black">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Overview Card */}
          <Card className="mb-8 border-l-4 border-l-[#F5BB07]">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#F5BB07]">
                    <Image
                      src={profilePictureSrc}
                      alt={profile?.full_name ?? "Profile"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {userVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#313D6A]">{safe(profile?.full_name, "")}</h2>
                    <Badge variant="secondary" className="bg-[#F5BB07] text-black">
                      {((profile?.expertise_level || "") + "").toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-lg text-gray-700 mb-3">{safe(profile?.headline, "")}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{safe(profile?.email)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{safe(profile?.phone)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {safe(profile?.city)}, {safe(profile?.country)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{((profile?.employment_type || "") + "").replace(/_/g, " ").toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {expertiseAreas.map((area, index) => (
                      <Badge key={index} className="bg-[#313D6A] text-white">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-[#313D6A] text-white rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold">${safe(profile?.hourly_rate, "0")}</div>
                    <div className="text-sm opacity-90">per hour</div>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[#F5BB07]">
                    <Star className="h-4 w-4" />
                    <span className="font-semibold">{averageRating !== null ? averageRating.toFixed(1) : "—"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-[#313D6A] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#313D6A]">{safe(profile?.total_courses, 0)}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-[#313D6A] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#313D6A]">{safe(profile?.total_students, 0)}</div>
                <div className="text-sm text-gray-600">Students Taught</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-[#313D6A] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#313D6A]">{safe(profile?.total_course_hours, 0)}</div>
                <div className="text-sm text-gray-600">Course Hours</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-[#313D6A] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#313D6A]">{safe(profile?.years_of_experience, 0)}</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#313D6A]">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="text-gray-800 mt-1">{safe(profile?.bio, "")}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age</label>
                    <p className="text-gray-800">{safe(profile?.age, "—")} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-800 capitalize">{safe(profile?.gender, "")}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-800">{safe(profile?.address, "")}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-800">{safe(profile?.department, "")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Education & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#313D6A]">
                  <GraduationCap className="h-5 w-5" />
                  Education & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Education</label>
                  {education.length === 0 && <div className="text-sm text-gray-600">No education data</div>}
                  {education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                      <div className="font-medium text-[#313D6A]">{safe(edu.degree, "")}</div>
                      <div className="text-sm text-gray-600">
                        {safe(edu.institution, "")} • {safe(edu.year, "")}
                      </div>
                    </div>
                  ))}
                </div>

                {certifications.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Certifications</label>
                      {certifications.map((cert, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg mb-2">
                          <div className="font-medium text-[#313D6A]">{safe(cert.name, "")}</div>
                          <div className="text-sm text-gray-600">Year: {safe(cert.year, "")}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Languages & Teaching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#313D6A]">
                  <Languages className="h-5 w-5" />
                  Languages & Teaching
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {languagesSpoken.length === 0 && <div className="text-sm text-gray-600">No languages listed</div>}
                    {languagesSpoken.map((lang, index) => (
                      <Badge key={index} variant="outline" className="border-[#313D6A] text-[#313D6A]">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Teaching Methods</label>
                  <div className="flex flex-wrap gap-2">
                    {preferredTeachingMethods.map((method, index) => (
                      <Badge key={index} className="bg-[#F5BB07] text-black">
                        {formatTeachingMethod(method)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Course Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {courseCategories.map((category, index) => (
                      <Badge key={index} className="bg-[#313D6A] text-white">
                        {formatCourseCategory(category)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Teaching Style</label>
                  <p className="text-gray-800 mt-1">{safe(profile?.teaching_style, "")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Social Links & Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#313D6A]">
                  <Globe className="h-5 w-5" />
                  Links & Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Social Links</label>
                  <div className="space-y-2">
                    {profile?.linkedin_profile && (
                      <a
                        href={profile.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        LinkedIn Profile
                      </a>
                    )}
                    {profile?.github_profile && (
                      <a
                        href={profile.github_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-800 hover:text-gray-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                        GitHub Profile
                      </a>
                    )}
                    {profile?.personal_website && (
                      <a
                        href={profile.personal_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#313D6A] hover:text-[#2A3458]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Personal Website
                      </a>
                    )}
                    {profile?.youtube_channel && (
                      <a
                        href={profile.youtube_channel}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-red-600 hover:text-red-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        YouTube Channel
                      </a>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Documents</label>
                  <div className="space-y-2">
                    {profile?.resume && (
                      <a
                        href={profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#313D6A] hover:text-[#2A3458]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Resume
                      </a>
                    )}
                    {profile?.degree_certificates && (
                      <a
                        href={profile.degree_certificates}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#313D6A] hover:text-[#2A3458]"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Degree Certificates
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Availability Schedule */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#313D6A]">
                <Calendar className="h-5 w-5" />
                Weekly Availability Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {Object.entries(availabilitySchedule).length === 0 && (
                  <div className="text-sm text-gray-600">No availability schedule set.</div>
                )}
                {Object.entries(availabilitySchedule).map(([day, times]) => (
                  <div key={day} className="text-center">
                    <div className="font-medium text-[#313D6A] mb-2">{day}</div>
                    <div className="space-y-1">
                      {(times || []).map((time, index) => (
                        <div key={index} className="bg-[#F5BB07] text-black text-xs px-2 py-1 rounded">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
