"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import {
  MapPin,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  Star,
  Award,
  Github,
  Linkedin,
  Globe,
  Clock,
  Languages,
  Bell,
} from "lucide-react";

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    let isMounted = true;

    const fetchStudentData = async () => {
      try {
        // read token only in the browser
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

        if (!token) {
          console.warn("No access token found in localStorage");
          if (isMounted) setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE}/api/auth/profile/update/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // support both shapes: { data: { ... } } or direct payload
          const payload = response.data?.data ?? response.data;
          if (isMounted) setStudentData(payload);
        } else {
          console.warn("Unexpected status while fetching profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudentData();

    return () => {
      isMounted = false;
    };
  }, [API_BASE]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load student profile data.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const profilePictureSrc = studentData?.profile_picture
    ? `${API_BASE}${studentData.profile_picture}`
    : "/placeholder.svg";

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-accent">
              <AvatarImage src={profilePictureSrc} alt={studentData.full_name || "Student"} />
              <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                {getInitials(studentData.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h1 className="text-4xl font-bold">{studentData.full_name}</h1>
                {studentData.user?.is_verified && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <p className="text-xl text-primary-foreground/80 mb-4">
                {studentData.field_of_study || "—"} Student at {studentData.institution || "—"}
              </p>

              <p className="text-primary-foreground/70 max-w-2xl">{studentData.bio}</p>

              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {studentData.city || "—"}, {studentData.country || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <Calendar className="w-4 h-4" />
                  <span>Age {studentData.age ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80">
                  <GraduationCap className="w-4 h-4" />
                  <span>Class of {studentData.graduation_year ?? "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Institution</h4>
                    <p className="text-muted-foreground">{studentData.institution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Field of Study</h4>
                    <p className="text-muted-foreground">{studentData.field_of_study}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Education Level</h4>
                    <p className="text-muted-foreground capitalize">
                      {studentData.education_level?.replace(/_/g, " ") ?? "—"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">GPA</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{studentData.gpa ?? "—"}</span>
                      <span className="text-muted-foreground">/4.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(studentData.skills || []).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-accent text-accent-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests Section */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(studentData.interests || []).map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            {((studentData.certificates || []).length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(studentData.certificates || []).map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">Uploaded on {formatDate(cert.uploaded_at)}</p>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">Certified</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Career Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  Career Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Employment Status</h4>
                    <p className="text-muted-foreground capitalize">{studentData.employment_status ?? "—"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Current Position</h4>
                    <p className="text-muted-foreground">{studentData.current_job_title ?? "—"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Company</h4>
                    <p className="text-muted-foreground">{studentData.company ?? "—"}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Career Goals</h4>
                  <p className="text-muted-foreground">{studentData.career_goals ?? "—"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary/80" />
                  <span className="text-sm">{studentData.email ?? "—"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary/80" />
                  <span className="text-sm">{studentData.phone ?? "—"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary/80 mt-0.5" />
                  <span className="text-sm">{studentData.address ?? "—"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentData.linkedin_profile && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={studentData.linkedin_profile} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn Profile
                    </a>
                  </Button>
                )}
                {studentData.github_profile && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={studentData.github_profile} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub Profile
                    </a>
                  </Button>
                )}
                {studentData.portfolio_website && (
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <a href={studentData.portfolio_website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Portfolio Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Academic Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance</span>
                    <span>{studentData.attendance_percentage ?? 0}%</span>
                  </div>
                  <Progress value={studentData.attendance_percentage ?? 0} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-secondary">{studentData.completed_courses_count ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Completed Courses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{studentData.current_courses_count ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Current Courses</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{studentData.completed_assignments ?? 0}</div>
                  <div className="text-xs text-muted-foreground">Assignments Completed</div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Learning Time
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(studentData.preferred_learning_time || []).map((time, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Languages className="w-4 h-4 text-accent" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(studentData.language_preferences || []).map((lang, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-accent" />
                    Notifications
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(studentData.notification_preferences || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="capitalize">{key}</span>
                        <Badge variant={value ? "default" : "secondary"} className="text-xs">
                          {value ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
