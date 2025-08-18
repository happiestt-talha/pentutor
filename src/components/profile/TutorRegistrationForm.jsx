"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, User, MapPin, GraduationCap, Briefcase, Globe, Calendar, Award, Link } from "lucide-react"
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"
import { useAuth } from "../auth/AuthContext"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function TutorRegistrationForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Base Information
    full_name: "",
    email: "",
    age: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    bio: "",
    profile_picture: null,

    // Professional Information
    headline: "",
    expertise_areas: [],
    expertise_level: "expert", // Default as per backend
    years_of_experience: 0,
    employment_type: "part_time", // Default as per backend
    department: "",
    hourly_rate: "",

    // Documents
    resume: null,
    degree_certificates: null,
    id_proof: null,

    // Qualifications (JSON arrays)
    education: [],
    certifications: [],
    awards: [],
    publications: [],

    // Course-Related
    teaching_style: "",
    languages_spoken: [],

    // Professional Links
    linkedin_profile: "",
    github_profile: "",
    personal_website: "",
    youtube_channel: "",
    social_links: {},

    // Availability & Preferences (JSON objects)
    availability_schedule: {},
    preferred_teaching_methods: [],
    course_categories: [],
    notification_preferences: { email: true, sms: false },

    // Legacy fields to maintain compatibility
    mobile_number_1: "",
    mobile_number_2: "",
    area: "",
    location: "",
    organization_name: "",
    designation: "",
    level: "",
    member_since: "",
    salary_package: "",
    timings_required: "",
    experience: "",
    areas_to_teach: "",
    can_teach_online: false,
    minimum_qualification_required: "",
    experience_required: "",
    subjects: [],
    qualifications: [],
    cnic: "",
    cnic_front: null,
    cnic_back: null,
    degree_image: null,
  })

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileNames, setFileNames] = useState({
    profile_picture: "",
    resume: "",
    degree_certificates: "",
    id_proof: "",
    cnic_front: "",
    cnic_back: "",
    degree_image: "",
  })

  const [educationEntries, setEducationEntries] = useState([{ institution: "", degree: "", year: "" }])
  const [certificationEntries, setCertificationEntries] = useState([{ name: "", year: "" }])
  const [awardEntries, setAwardEntries] = useState([{ title: "", year: "", description: "" }])
  const [publicationEntries, setPublicationEntries] = useState([{ title: "", year: "", journal: "" }])
  const [socialLinksEntries, setSocialLinksEntries] = useState({ twitter: "", facebook: "", instagram: "" })

  const [availableSubjects, setAvailableSubjects] = useState([
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
    { id: 4, name: "Biology" },
    { id: 5, name: "English" },
    { id: 6, name: "Computer Science" },
  ])

  const [availableQualifications, setAvailableQualifications] = useState([
    { id: 1, name: "Bachelor's Degree" },
    { id: 2, name: "Master's Degree" },
    { id: 3, name: "PhD" },
    { id: 4, name: "Teaching Certificate" },
  ])

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]

  const expertiseLevelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
    { value: "master", label: "Master" },
  ]

  const employmentTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ]

  const teachingMethodOptions = [
    "video_lectures",
    "live_qna",
    "interactive_sessions",
    "assignments",
    "group_discussions",
    "one_on_one",
    "workshops",
    "practical_demos",
  ]

  const courseCategoryOptions = [
    "programming",
    "science",
    "mathematics",
    "languages",
    "business",
    "arts",
    "music",
    "sports",
    "technology",
    "design",
  ]

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Arabic",
    "Hindi",
    "Portuguese",
    "Russian",
    "Italian",
    "Korean",
  ]

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const timezoneOptions = [
    { value: "GMT-12:00", label: "GMT-12:00 (Baker Island)" },
    { value: "GMT-11:00", label: "GMT-11:00 (American Samoa)" },
    { value: "GMT-10:00", label: "GMT-10:00 (Hawaii)" },
    { value: "GMT-09:00", label: "GMT-09:00 (Alaska)" },
    { value: "GMT-08:00", label: "GMT-08:00 (Pacific Time)" },
    { value: "GMT-07:00", label: "GMT-07:00 (Mountain Time)" },
    { value: "GMT-06:00", label: "GMT-06:00 (Central Time)" },
    { value: "GMT-05:00", label: "GMT-05:00 (Eastern Time)" },
    { value: "GMT-04:00", label: "GMT-04:00 (Atlantic Time)" },
    { value: "GMT-03:00", label: "GMT-03:00 (Brazil)" },
    { value: "GMT-02:00", label: "GMT-02:00 (Mid-Atlantic)" },
    { value: "GMT-01:00", label: "GMT-01:00 (Azores)" },
    { value: "GMT+00:00", label: "GMT+00:00 (London, Dublin)" },
    { value: "GMT+01:00", label: "GMT+01:00 (Paris, Berlin)" },
    { value: "GMT+02:00", label: "GMT+02:00 (Cairo, Athens)" },
    { value: "GMT+03:00", label: "GMT+03:00 (Moscow, Nairobi)" },
    { value: "GMT+04:00", label: "GMT+04:00 (Dubai, Baku)" },
    { value: "GMT+05:00", label: "GMT+05:00 (Karachi, Tashkent)" },
    { value: "GMT+05:30", label: "GMT+05:30 (India, Sri Lanka)" },
    { value: "GMT+06:00", label: "GMT+06:00 (Dhaka, Almaty)" },
    { value: "GMT+07:00", label: "GMT+07:00 (Bangkok, Jakarta)" },
    { value: "GMT+08:00", label: "GMT+08:00 (Beijing, Singapore)" },
    { value: "GMT+09:00", label: "GMT+09:00 (Tokyo, Seoul)" },
    { value: "GMT+10:00", label: "GMT+10:00 (Sydney, Melbourne)" },
    { value: "GMT+11:00", label: "GMT+11:00 (Solomon Islands)" },
    { value: "GMT+12:00", label: "GMT+12:00 (New Zealand)" },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token || !user?.id) {
          // Don't spam toast on page load for unauthenticated users — just stop loading
          setLoading(false)
          return
        }
        const response = await axios.get(`${API_BASE}/api/auth/profile/update/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // be defensive about response shape
        const payload = response.data
        const data = payload?.data ?? payload

        const normalizeArray = (v) => (Array.isArray(v) ? v : [])
        const normalizeObject = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {})

        setFormData((prev) => ({
          ...prev,
          full_name: data.full_name ?? "",
          email: data.email ?? "",
          age: data.age ?? "",
          date_of_birth: data.date_of_birth ?? "",
          gender: data.gender ?? "",
          phone: data.phone ?? data.mobile_number_1 ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          bio: data.bio ?? "",
          profile_picture: null,

          headline: data.headline ?? "",
          expertise_areas: normalizeArray(data.expertise_areas),
          expertise_level: data.expertise_level ?? "expert",
          years_of_experience: data.years_of_experience ?? 0,
          employment_type: data.employment_type ?? "part_time",
          department: data.department ?? "",
          hourly_rate: data.hourly_rate ?? "",

          resume: null,
          degree_certificates: null,
          id_proof: null,

          education: normalizeArray(data.education),
          certifications: normalizeArray(data.certifications),
          awards: normalizeArray(data.awards),
          publications: normalizeArray(data.publications),

          teaching_style: data.teaching_style ?? "",
          languages_spoken: normalizeArray(data.languages_spoken),

          linkedin_profile: data.linkedin_profile ?? "",
          github_profile: data.github_profile ?? "",
          personal_website: data.personal_website ?? "",
          youtube_channel: data.youtube_channel ?? "",
          social_links: normalizeObject(data.social_links),

          availability_schedule: normalizeObject(data.availability_schedule),
          preferred_teaching_methods: normalizeArray(data.preferred_teaching_methods),
          course_categories: normalizeArray(data.course_categories),
          notification_preferences: normalizeObject(data.notification_preferences) || { email: true, sms: false },

          mobile_number_1: data.mobile_number_1 ?? "",
          mobile_number_2: data.mobile_number_2 ?? "",
          area: data.area ?? "",
          location: data.location ?? "",
          organization_name: data.organization_name ?? "",
          designation: data.designation ?? "",
          level: data.level ?? "",
          member_since: data.member_since ?? "",
          salary_package: data.salary_package ?? "",
          timings_required: data.timings_required ?? "",
          experience: data.experience ?? "",
          areas_to_teach: data.areas_to_teach ?? "",
          can_teach_online: data.can_teach_online ?? false,
          minimum_qualification_required: data.minimum_qualification_required ?? "",
          experience_required: data.experience_required ?? "",
          subjects: normalizeArray(data.subjects),
          qualifications: normalizeArray(data.qualifications),
          cnic: data.cnic ?? "",
          cnic_front: null,
          cnic_back: null,
          degree_image: null,
        }))

        // Set dynamic arrays defensively
        if (data.education && Array.isArray(data.education) && data.education.length > 0) setEducationEntries(data.education)
        if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0)
          setCertificationEntries(data.certifications)
        if (data.awards && Array.isArray(data.awards) && data.awards.length > 0) setAwardEntries(data.awards)
        if (data.publications && Array.isArray(data.publications) && data.publications.length > 0)
          setPublicationEntries(data.publications)
        if (data.social_links && typeof data.social_links === "object") setSocialLinksEntries(data.social_links)
      } catch (error) {
        console.error(error)
        toast.error("Something went wrong while loading profile data.")
      } finally {
        setLoading(false)
      }
    }

    //  user?.role === "teacher" && fetchProfile()
    fetchProfile()

  }, [user?.id])

  const validateCNIC = (cnic) => {
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/
    return cnicPattern.test(cnic)
  }

  // validate on blur instead of every keystroke
  const handleCNICBlur = (e) => {
    const { value } = e.target
    if (value && !validateCNIC(value)) {
      toast.error("CNIC format should be xxxxx-xxxxxxx-x")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))
    }
  }

  const handleArrayFieldToggle = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] && Array.isArray(prev[fieldName]) ?
        (prev[fieldName].includes(value) ? prev[fieldName].filter((item) => item !== value) : [...prev[fieldName], value])
        : [value],
    }))
  }

  const handleScheduleChange = (day, timeSlots) => {
    setFormData((prev) => ({
      ...prev,
      availability_schedule: {
        ...prev.availability_schedule,
        [day]: timeSlots
          .split(",")
          .map((slot) => slot.trim())
          .filter((slot) => slot),
      },
    }))
  }

  // more robust dynamic handlers (explicit field name)
  const handleDynamicArrayChange = (fieldName, entries, setEntries, index, field, value) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEntries(newEntries)

    setFormData((prev) => ({ ...prev, [fieldName]: newEntries }))
  }

  const addDynamicEntry = (fieldName, entries, setEntries, template) => {
    const newEntries = [...entries, template]
    setEntries(newEntries)
    setFormData((prev) => ({ ...prev, [fieldName]: newEntries }))
  }

  const removeDynamicEntry = (fieldName, entries, setEntries, index) => {
    const newEntries = entries.filter((_, i) => i !== index)
    setEntries(newEntries)
    setFormData((prev) => ({ ...prev, [fieldName]: newEntries }))
  }

  const handleSubjectToggle = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects && Array.isArray(prev.subjects)
        ? (prev.subjects.includes(subjectId) ? prev.subjects.filter((id) => id !== subjectId) : [...prev.subjects, subjectId])
        : [subjectId],
    }))
  }

  const handleQualificationToggle = (qualificationId) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications && Array.isArray(prev.qualifications)
        ? (prev.qualifications.includes(qualificationId) ? prev.qualifications.filter((id) => id !== qualificationId) : [...prev.qualifications, qualificationId])
        : [qualificationId],
    }))
  }

  const appendIf = (form, key, value) => {
    if (value === null || value === undefined) return
    // Files
    if (typeof File !== "undefined" && value instanceof File) {
      form.append(key, value)
      return
    }
    // FileList
    if (typeof FileList !== "undefined" && value instanceof FileList) {
      Array.from(value).forEach((f) => form.append(key, f))
      return
    }
    // Arrays
    if (Array.isArray(value)) {
      if (value.length) form.append(key, JSON.stringify(value))
      return
    }
    // Objects -> stringify if not empty
    if (typeof value === "object") {
      if (Object.keys(value).length) form.append(key, JSON.stringify(value))
      return
    }
    // booleans & primitives
    form.append(key, String(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.full_name) {
      toast.error("Full name is required")
      setIsSubmitting(false)
      return
    }

    if (formData.cnic && !validateCNIC(formData.cnic)) {
      toast.error("Please enter a valid CNIC format (xxxxx-xxxxxxx-x)")
      setIsSubmitting(false)
      return
    }

    const data = new FormData()

    // required JSON fields we MUST send (force presence)
    const requiredJsonKeys = [
      "expertise_areas",
      "education",
      "languages_spoken",
      "availability_schedule",
      "preferred_teaching_methods",
      "course_categories",
    ]

    const ensureJson = {
      expertise_areas: Array.isArray(formData.expertise_areas) ? formData.expertise_areas : [],
      education:
        Array.isArray(formData.education) && formData.education.length > 0
          ? formData.education
          : Array.isArray(educationEntries) && educationEntries.length > 0
            ? educationEntries
            : [],
      languages_spoken: Array.isArray(formData.languages_spoken) ? formData.languages_spoken : [],
      availability_schedule:
        formData.availability_schedule && typeof formData.availability_schedule === "object"
          ? formData.availability_schedule
          : {},
      preferred_teaching_methods: Array.isArray(formData.preferred_teaching_methods)
        ? formData.preferred_teaching_methods
        : [],
      course_categories: Array.isArray(formData.course_categories) ? formData.course_categories : [],
    }

    // Append everything except the required JSON keys and notification/social (we'll set them explicitly)
    Object.keys(formData).forEach((key) => {
      if (requiredJsonKeys.includes(key)) return
      if (key === "notification_preferences" || key === "social_links") return
      appendIf(data, key, formData[key])
    })

    // Now explicitly set the required JSON fields (stringified)
    // Object.entries(ensureJson).forEach(([k, v]) => {
    //   data.set(k, JSON.stringify(v))
    // })
    // --- set required JSON fields in two formats (JSON string + repeated [] entries) ---
    Object.entries(ensureJson).forEach(([k, v]) => {
      // Always include a JSON string (safe for JSONField parsing)
      data.set(k, JSON.stringify(v))

      // Also append repeated keys for array parsing on some backends
      if (Array.isArray(v)) {
        v.forEach((item) => {
          // For primitives append item directly, for objects stringify each item
          if (item === null || item === undefined) return
          if (typeof item === "object") {
            data.append(`${k}[]`, JSON.stringify(item))
          } else {
            data.append(`${k}[]`, String(item))
          }
        })
      } else if (typeof v === "object" && v !== null) {
        // For availability_schedule (object), some servers accept flattened keys like:
        // availability_schedule[Monday] = JSON.stringify([...])
        // We'll also add keys for each day to help parsers that expect nested form syntax.
        Object.entries(v).forEach(([subKey, subVal]) => {
          if (subVal === null || subVal === undefined) return
          // subVal may be an array of timeslots -> append as JSON string and as repeated items
          data.append(`${k}[${subKey}]`, JSON.stringify(subVal))
          if (Array.isArray(subVal)) {
            subVal.forEach((slot) => {
              data.append(`${k}[${subKey}][]`, String(slot))
            })
          }
        })
      }
    })


    // Ensure notification_preferences & social_links are JSON strings
    if (formData.notification_preferences && typeof formData.notification_preferences === "object") {
      data.set("notification_preferences", JSON.stringify(formData.notification_preferences))
    } else {
      data.set("notification_preferences", JSON.stringify({ email: true, sms: false }))
    }
    if (formData.social_links && typeof formData.social_links === "object") {
      data.set("social_links", JSON.stringify(formData.social_links))
    } else {
      data.set("social_links", JSON.stringify({}))
    }

    // Debug: inspect what is sent (open console -> Network to verify)
    for (const pair of data.entries()) {
      console.log(pair[0], ":", pair[1])
    }

    try {
      const token = localStorage.getItem("access_token")
      const response = await axios.post(`${API_BASE}/api/auth/teacher-profile/create/`, data, {
        headers: { Authorization: `Bearer ${token}` },
        
      })

      if (response.status === 201 || response.status === 200) {
        toast.success("Profile updated successfully!")
        router.push("/tutor/dashboard")
      } else {
        const errorData = response.data
        toast.error(`Failed to update profile: ${JSON.stringify(errorData)}`)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Backend error:", error.response.data)
        const errs = error.response.data.errors ?? error.response.data
        toast.error(`Failed: ${typeof errs === "string" ? errs : JSON.stringify(errs)}`)
      } else {
        console.error(error)
        toast.error("An error occurred while updating your profile.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  if (loading) {
    return <Loader text="Loading Profile..." />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutor Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Full Name *"
                required
              />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" />
              <Input name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Age" />
              <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                placeholder="Date of Birth"
              />
              <Input
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                onBlur={handleCNICBlur}
                placeholder="CNIC (xxxxx-xxxxxxx-x)"
              />
            </div>
            <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Address" />
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="A brief bio about yourself and your teaching philosophy"
            />
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin />
              Location & Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" />
              <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="area" value={formData.area} onChange={handleInputChange} placeholder="Area/District" />
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Specific Location"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase />
              Professional Information
            </h3>
            <Input
              name="headline"
              value={formData.headline}
              onChange={handleInputChange}
              placeholder="Professional Headline (e.g., 'Experienced Math Tutor')"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                onValueChange={(value) => handleSelectChange("expertise_level", value)}
                value={formData.expertise_level}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Expertise Level" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                name="years_of_experience"
                type="number"
                value={formData.years_of_experience}
                onChange={handleInputChange}
                placeholder="Years of Experience"
              />
              <Select
                onValueChange={(value) => handleSelectChange("employment_type", value)}
                value={formData.employment_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department/Field"
              />
              <Input
                name="hourly_rate"
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={handleInputChange}
                placeholder="Hourly Rate (USD)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expertise Areas</label>
              <Input
                placeholder="Enter expertise areas separated by commas (e.g., Mathematics, Physics, Chemistry)"
                value={formData.expertise_areas.join(", ")}
                onChange={(e) => {
                  const areas = e.target.value
                    .split(",")
                    .map((area) => area.trim())
                    .filter((area) => area)
                  setFormData((prev) => ({ ...prev, expertise_areas: areas }))
                }}
              />
            </div>

            {/* Legacy fields for backward compatibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                placeholder="Current Organization"
              />
              <Input
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Current Designation"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <GraduationCap />
              Education
            </h3>
            {educationEntries.map((entry, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  {educationEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDynamicEntry("education", educationEntries, setEducationEntries, index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Institution"
                    value={entry.institution || ""}
                    onChange={(e) =>
                      handleDynamicArrayChange("education", educationEntries, setEducationEntries, index, "institution", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Degree"
                    value={entry.degree || ""}
                    onChange={(e) =>
                      handleDynamicArrayChange("education", educationEntries, setEducationEntries, index, "degree", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Year"
                    type="number"
                    value={entry.year || ""}
                    onChange={(e) =>
                      handleDynamicArrayChange("education", educationEntries, setEducationEntries, index, "year", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addDynamicEntry("education", educationEntries, setEducationEntries, { institution: "", degree: "", year: "" })}
            >
              Add Education
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Award />
              Certifications
            </h3>
            {certificationEntries.map((entry, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Certification {index + 1}</h4>
                  {certificationEntries.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDynamicEntry("certifications", certificationEntries, setCertificationEntries, index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Certification Name"
                    value={entry.name || ""}
                    onChange={(e) =>
                      handleDynamicArrayChange("certifications", certificationEntries, setCertificationEntries, index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Year"
                    type="number"
                    value={entry.year || ""}
                    onChange={(e) =>
                      handleDynamicArrayChange("certifications", certificationEntries, setCertificationEntries, index, "year", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addDynamicEntry("certifications", certificationEntries, setCertificationEntries, { name: "", year: "" })}
            >
              Add Certification
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <GraduationCap />
              Teaching & Course Information
            </h3>
            <Textarea
              name="teaching_style"
              value={formData.teaching_style}
              onChange={handleInputChange}
              placeholder="Describe your teaching style and methodology"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Languages Spoken</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {languageOptions.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={formData.languages_spoken.includes(language)}
                      onCheckedChange={() => handleArrayFieldToggle("languages_spoken", language)}
                    />
                    <label htmlFor={`language-${language}`} className="text-sm">
                      {language}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Teaching Methods</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {teachingMethodOptions.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={`method-${method}`}
                      checked={formData.preferred_teaching_methods.includes(method)}
                      onCheckedChange={() => handleArrayFieldToggle("preferred_teaching_methods", method)}
                    />
                    <label htmlFor={`method-${method}`} className="text-sm">
                      {method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Course Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {courseCategoryOptions.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={formData.course_categories.includes(category)}
                      onCheckedChange={() => handleArrayFieldToggle("course_categories", category)}
                    />
                    <label htmlFor={`category-${category}`} className="text-sm">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Link />
              Professional Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="linkedin_profile"
                value={formData.linkedin_profile}
                onChange={handleInputChange}
                placeholder="LinkedIn Profile URL"
              />
              <Input
                name="github_profile"
                value={formData.github_profile}
                onChange={handleInputChange}
                placeholder="GitHub Profile URL"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="personal_website"
                value={formData.personal_website}
                onChange={handleInputChange}
                placeholder="Personal Website URL"
              />
              <Input
                name="youtube_channel"
                value={formData.youtube_channel}
                onChange={handleInputChange}
                placeholder="YouTube Channel URL"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Social Media Links</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Twitter URL"
                  value={socialLinksEntries.twitter || ""}
                  onChange={(e) => {
                    const newSocialLinks = { ...socialLinksEntries, twitter: e.target.value }
                    setSocialLinksEntries(newSocialLinks)
                    setFormData((prev) => ({ ...prev, social_links: newSocialLinks }))
                  }}
                />
                <Input
                  placeholder="Facebook URL"
                  value={socialLinksEntries.facebook || ""}
                  onChange={(e) => {
                    const newSocialLinks = { ...socialLinksEntries, facebook: e.target.value }
                    setSocialLinksEntries(newSocialLinks)
                    setFormData((prev) => ({ ...prev, social_links: newSocialLinks }))
                  }}
                />
                <Input
                  placeholder="Instagram URL"
                  value={socialLinksEntries.instagram || ""}
                  onChange={(e) => {
                    const newSocialLinks = { ...socialLinksEntries, instagram: e.target.value }
                    setSocialLinksEntries(newSocialLinks)
                    setFormData((prev) => ({ ...prev, social_links: newSocialLinks }))
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar />
              Availability Schedule
            </h3>
            <div className="space-y-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <label className="text-sm font-medium">{day}</label>
                  <div className="md:col-span-3">
                    <Input
                      placeholder="Time slots (e.g., 9:00-12:00, 14:00-16:00)"
                      value={formData.availability_schedule[day]?.join(", ") || ""}
                      onChange={(e) => handleScheduleChange(day, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Upload />
              Document Uploads
            </h3>

            {/* Profile Picture */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Picture</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profile_picture")}
                  className="hidden"
                />
                <label htmlFor="profile_picture" className="cursor-pointer">
                  <p className="text-gray-500">{fileNames.profile_picture || "Click to upload profile picture"}</p>
                </label>
              </div>
            </div>

            {/* Resume */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume/CV</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "resume")}
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <p className="text-gray-500">{fileNames.resume || "Click to upload resume/CV"}</p>
                </label>
              </div>
            </div>

            {/* Degree Certificates */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Degree Certificates</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="degree_certificates"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "degree_certificates")}
                  className="hidden"
                />
                <label htmlFor="degree_certificates" className="cursor-pointer">
                  <p className="text-gray-500">{fileNames.degree_certificates || "Click to upload degree certificates"}</p>
                </label>
              </div>
            </div>

            {/* ID Proof */}
            <div className="space-y-2">
              <label className="text-sm font-medium">ID Proof</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="id_proof"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, "id_proof")}
                  className="hidden"
                />
                <label htmlFor="id_proof" className="cursor-pointer">
                  <p className="text-gray-500">{fileNames.id_proof || "Click to upload ID proof"}</p>
                </label>
              </div>
            </div>

            {/* Legacy file uploads for backward compatibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CNIC Front</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Input
                    id="cnic_front"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cnic_front")}
                    className="hidden"
                  />
                  <label htmlFor="cnic_front" className="cursor-pointer">
                    <p className="text-gray-500">{fileNames.cnic_front || "CNIC Front"}</p>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CNIC Back</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Input
                    id="cnic_back"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cnic_back")}
                    className="hidden"
                  />
                  <label htmlFor="cnic_back" className="cursor-pointer">
                    <p className="text-gray-500">{fileNames.cnic_back || "CNIC Back"}</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe />
              Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email_notifications"
                  checked={formData.notification_preferences.email}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, email: checked },
                    }))
                  }}
                />
                <label htmlFor="email_notifications" className="text-sm font-medium">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms_notifications"
                  checked={formData.notification_preferences.sms}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      notification_preferences: { ...prev.notification_preferences, sms: checked },
                    }))
                  }}
                />
                <label htmlFor="sms_notifications" className="text-sm font-medium">
                  SMS Notifications
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="can_teach_online"
                  checked={formData.can_teach_online}
                  onCheckedChange={(checked) => handleCheckboxChange("can_teach_online", checked)}
                />
                <label htmlFor="can_teach_online" className="text-sm font-medium">
                  Available for Online Teaching
                </label>
              </div>
            </div>
          </div>

          {/* Legacy Academic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <GraduationCap />
              Legacy Academic & Teaching
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="minimum_qualification_required"
                value={formData.minimum_qualification_required}
                onChange={handleInputChange}
                placeholder="Minimum Qualification Required"
              />
              <Input
                name="experience_required"
                value={formData.experience_required}
                onChange={handleInputChange}
                placeholder="Experience Required"
              />
            </div>
            <Textarea
              name="areas_to_teach"
              value={formData.areas_to_teach}
              onChange={handleInputChange}
              placeholder="Detailed description of areas you can teach"
            />

            {/* Subjects Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subjects (Select multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={formData.subjects.includes(subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject.id)}
                    />
                    <label htmlFor={`subject-${subject.id}`} className="text-sm">
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualifications Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualifications (Select multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableQualifications.map((qualification) => (
                  <div key={qualification.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`qualification-${qualification.id}`}
                      checked={formData.qualifications.includes(qualification.id)}
                      onCheckedChange={() => handleQualificationToggle(qualification.id)}
                    />
                    <label htmlFor={`qualification-${qualification.id}`} className="text-sm">
                      {qualification.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader text="Saving..." /> : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
