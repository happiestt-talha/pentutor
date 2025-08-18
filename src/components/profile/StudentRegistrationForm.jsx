"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  User,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  CalendarIcon,
  FileText,
  Briefcase,
  Globe,
  Star,
} from "lucide-react"
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"
import { useAuth } from "../auth/AuthContext"
import axios from "axios"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    age: "",
    gender: "",
    bio: "",

    // Location
    address: "",
    city: "",
    country: "",

    // Academic Information
    education_level: "",
    institution: "",
    field_of_study: "",
    graduation_year: "",
    gpa: "",

    // Employment Information
    employment_status: "",
    current_job_title: "",
    company: "",
    career_goals: "",

    // Social Profiles
    linkedin_profile: "",
    github_profile: "",
    portfolio_website: "",

    // Skills & Interests (as arrays)
    skills: [],
    interests: [],

    // Preferences (as arrays)
    preferred_learning_time: [],
    notification_preferences: [],
    language_preferences: [],
    social_links: [],

    // File uploads
    profile_picture: null,
    cnic_or_form_b_picture: null,
    degree: null,
    certificates: [],
  })

  const [certificates, setCertificates] = useState([])
  const [newCertificateName, setNewCertificateName] = useState("")

  // Skills and interests management
  const [skillsList, setSkillsList] = useState([])
  const [interestsList, setInterestsList] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")

  // Preferences management
  const [preferredLearningTimes, setPreferredLearningTimes] = useState([])
  const [notificationPrefs, setNotificationPrefs] = useState([])
  const [languagePrefs, setLanguagePrefs] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [newPreferredTime, setNewPreferredTime] = useState("")
  const [newNotificationPref, setNewNotificationPref] = useState("")
  const [newLanguagePref, setNewLanguagePref] = useState("")
  const [newSocialLink, setNewSocialLink] = useState("")

  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState(null)
  const [fileNames, setFileNames] = useState({
    profile_picture: "",
    cnic_or_form_b_picture: "",
    degree: "",
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          toast.error("Authentication required.")
          return
        }

        const response = await axios.get(`${API_BASE}/api/auth/profile/update/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Profile Response:", response.data)
        if (response.status === 200) {
          const { data } = response.data
          setFormData({
            full_name: data.full_name || "",
            first_name: data.first_name || data.user?.first_name || "",
            last_name: data.last_name || data.user?.last_name || "",
            email: data.email || data.user?.email || "",
            phone: data.phone || "",
            date_of_birth: data.date_of_birth || "",
            age: data.age || "",
            gender: data.gender || data.user?.gender || "",
            bio: data.bio || "",
            address: data.address || "",
            city: data.city || data.user?.city || "",
            country: data.country || data.user?.country || "",
            education_level: data.education_level || "",
            institution: data.institution || "",
            field_of_study: data.field_of_study || "",
            graduation_year: data.graduation_year || "",
            gpa: data.gpa || "",
            employment_status: data.employment_status || "",
            current_job_title: data.current_job_title || "",
            company: data.company || "",
            career_goals: data.career_goals || "",
            linkedin_profile: data.linkedin_profile || "",
            github_profile: data.github_profile || "",
            portfolio_website: data.portfolio_website || "",
            skills: [], // Change from {} to []
            interests: [], // Change from {} to []
            preferred_learning_time: data.preferred_learning_time || [],
            notification_preferences: data.notification_preferences || [],
            language_preferences: data.language_preferences || [],
            social_links: data.social_links || [],
            profile_picture: null,
            cnic_or_form_b_picture: null,
            degree: null,
            certificates: data.certificates || [],
          })

          if (data.date_of_birth) {
            setDateOfBirth(new Date(data.date_of_birth))
          }

          // Initialize skills and interests as arrays
          if (data.skills) {
            if (Array.isArray(data.skills)) {
              setSkillsList(data.skills.map((skill, index) => ({ id: Date.now() + index, name: skill })))
              setFormData((prev) => ({ ...prev, skills: data.skills }))
            } else if (typeof data.skills === "object") {
              const skillsArray = Object.keys(data.skills)
              setSkillsList(skillsArray.map((skill, index) => ({ id: Date.now() + index, name: skill })))
              setFormData((prev) => ({ ...prev, skills: skillsArray }))
            }
          }

          if (data.interests) {
            if (Array.isArray(data.interests)) {
              setInterestsList(
                data.interests.map((interest, index) => ({ id: Date.now() + index + 1000, name: interest })),
              )
              setFormData((prev) => ({ ...prev, interests: data.interests }))
            } else if (typeof data.interests === "object") {
              const interestsArray = Object.keys(data.interests)
              setInterestsList(
                interestsArray.map((interest, index) => ({ id: Date.now() + index + 1000, name: interest })),
              )
              setFormData((prev) => ({ ...prev, interests: interestsArray }))
            }
          }

          // Initialize certificates
          if (data.certificates) {
            let certArray = []
            if (Array.isArray(data.certificates)) {
              certArray = data.certificates.map((cert, index) => ({
                id: Date.now() + index,
                name: cert.name || `Certificate ${index + 1}`,
                file: null,
                uploaded_file_url: cert.file_url || null,
              }))
            } else if (typeof data.certificates === "object") {
              certArray = Object.keys(data.certificates).map((name, index) => ({
                id: Date.now() + index,
                name,
                file: null,
                uploaded_file_url: data.certificates[name],
              }))
            }
            setCertificates(certArray)
          }

          // Initialize preferences as arrays
          if (data.preferred_learning_time) {
            if (Array.isArray(data.preferred_learning_time)) {
              setPreferredLearningTimes(
                data.preferred_learning_time.map((time, index) => ({ id: Date.now() + index + 2000, name: time })),
              )
              setFormData((prev) => ({ ...prev, preferred_learning_time: data.preferred_learning_time }))
            }
          }

          if (data.notification_preferences) {
            if (Array.isArray(data.notification_preferences)) {
              setNotificationPrefs(
                data.notification_preferences.map((pref, index) => ({ id: Date.now() + index + 3000, name: pref })),
              )
              setFormData((prev) => ({ ...prev, notification_preferences: data.notification_preferences }))
            }
          }

          if (data.language_preferences) {
            if (Array.isArray(data.language_preferences)) {
              setLanguagePrefs(
                data.language_preferences.map((lang, index) => ({ id: Date.now() + index + 4000, name: lang })),
              )
              setFormData((prev) => ({ ...prev, language_preferences: data.language_preferences }))
            }
          }

          if (data.social_links) {
            if (Array.isArray(data.social_links)) {
              setSocialLinks(data.social_links.map((link, index) => ({ id: Date.now() + index + 5000, name: link })))
              setFormData((prev) => ({ ...prev, social_links: data.social_links }))
            }
          }
        } else {
          toast.error("Failed to load profile data.")
        }
      } catch (error) {
        toast.error("An error occurred while fetching your profile.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id && user.role === "student") {
     fetchProfile()
    } else {
      setLoading(false)
    }
  }, [user?.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (name, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
    }))
  }

  const handleDateChange = (date) => {
    setDateOfBirth(date)
    setFormData((prev) => ({
      ...prev,
      date_of_birth: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))
    }
  }

  // Skills management - change to array format
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skill = { id: Date.now(), name: newSkill.trim() }
      setSkillsList([...skillsList, skill])
      setNewSkill("")

      // Update formData skills as array
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.name],
      }))
    }
  }

  const handleRemoveSkill = (skillId) => {
    const skillToRemove = skillsList.find((skill) => skill.id === skillId)
    const updatedSkillsList = skillsList.filter((skill) => skill.id !== skillId)
    setSkillsList(updatedSkillsList)

    if (skillToRemove) {
      setFormData((prev) => ({
        ...prev,
        skills: updatedSkillsList.map((s) => s.name),
      }))
    }
  }

  // Interests management - change to array format
  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const interest = { id: Date.now(), name: newInterest.trim() }
      setInterestsList([...interestsList, interest])
      setNewInterest("")

      // Update formData interests as array
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest.name],
      }))
    }
  }

  const handleRemoveInterest = (interestId) => {
    const interestToRemove = interestsList.find((interest) => interest.id === interestId)
    const updatedInterestsList = interestsList.filter((interest) => interest.id !== interestId)
    setInterestsList(updatedInterestsList)

    if (interestToRemove) {
      setFormData((prev) => ({
        ...prev,
        interests: updatedInterestsList.map((i) => i.name),
      }))
    }
  }

  // Preferred Learning Time management
  const handleAddPreferredTime = () => {
    if (newPreferredTime.trim()) {
      const time = { id: Date.now(), name: newPreferredTime.trim() }
      setPreferredLearningTimes([...preferredLearningTimes, time])
      setNewPreferredTime("")

      setFormData((prev) => ({
        ...prev,
        preferred_learning_time: [...prev.preferred_learning_time, time.name],
      }))
    }
  }

  const handleRemovePreferredTime = (timeId) => {
    const updatedTimes = preferredLearningTimes.filter((time) => time.id !== timeId)
    setPreferredLearningTimes(updatedTimes)

    setFormData((prev) => ({
      ...prev,
      preferred_learning_time: updatedTimes.map((t) => t.name),
    }))
  }

  // Notification Preferences management
  const handleAddNotificationPref = () => {
    if (newNotificationPref.trim()) {
      const pref = { id: Date.now(), name: newNotificationPref.trim() }
      setNotificationPrefs([...notificationPrefs, pref])
      setNewNotificationPref("")

      setFormData((prev) => ({
        ...prev,
        notification_preferences: [...prev.notification_preferences, pref.name],
      }))
    }
  }

  const handleRemoveNotificationPref = (prefId) => {
    const updatedPrefs = notificationPrefs.filter((pref) => pref.id !== prefId)
    setNotificationPrefs(updatedPrefs)

    setFormData((prev) => ({
      ...prev,
      notification_preferences: updatedPrefs.map((p) => p.name),
    }))
  }

  // Language Preferences management
  const handleAddLanguagePref = () => {
    if (newLanguagePref.trim()) {
      const lang = { id: Date.now(), name: newLanguagePref.trim() }
      setLanguagePrefs([...languagePrefs, lang])
      setNewLanguagePref("")

      setFormData((prev) => ({
        ...prev,
        language_preferences: [...prev.language_preferences, lang.name],
      }))
    }
  }

  const handleRemoveLanguagePref = (langId) => {
    const updatedLangs = languagePrefs.filter((lang) => lang.id !== langId)
    setLanguagePrefs(updatedLangs)

    setFormData((prev) => ({
      ...prev,
      language_preferences: updatedLangs.map((l) => l.name),
    }))
  }

  // Social Links management
  const handleAddSocialLink = () => {
    if (newSocialLink.trim()) {
      const link = { id: Date.now(), name: newSocialLink.trim() }
      setSocialLinks([...socialLinks, link])
      setNewSocialLink("")

      setFormData((prev) => ({
        ...prev,
        social_links: [...prev.social_links, link.name],
      }))
    }
  }

  const handleRemoveSocialLink = (linkId) => {
    const updatedLinks = socialLinks.filter((link) => link.id !== linkId)
    setSocialLinks(updatedLinks)

    setFormData((prev) => ({
      ...prev,
      social_links: updatedLinks.map((l) => l.name),
    }))
  }

  // Certificate management
  const handleAddCertificate = () => {
    if (newCertificateName.trim()) {
      const newCertificate = {
        id: Date.now(),
        name: newCertificateName.trim(),
        file: null,
        uploaded_file_url: null,
      }
      setCertificates([...certificates, newCertificate])
      setNewCertificateName("")
    }
  }

  const handleCertificateFileChange = (certificateId, file) => {
    setCertificates(certificates.map((cert) => (cert.id === certificateId ? { ...cert, file } : cert)))
  }

  const handleRemoveCertificate = (certificateId) => {
    setCertificates(certificates.filter((cert) => cert.id !== certificateId))
  }

  const arrayToObjectTrue = (arr = []) => {
    // convert ["Email","SMS"] => { Email: true, SMS: true }
    if (!Array.isArray(arr)) return {}
    return arr.reduce((acc, cur) => {
      if (typeof cur === "string" && cur.trim()) acc[cur.trim()] = true
      return acc
    }, {})
  }

  const socialLinksArrayToObject = (arr = []) => {
    // Accept entries like "twitter:https://..." or "Twitter|https://..." or just "Twitter"
    // Output object { twitter: "https://...", Twitter2: "" }
    if (!Array.isArray(arr)) return {}
    const obj = {}
    arr.forEach((entry, i) => {
      if (!entry || typeof entry !== "string") return
      const trimmed = entry.trim()
      // try separators :, |, =>
      let key, val
      if (trimmed.includes("://")) {
        // if URL present, try to split by first space or pipe/colon
        const parts = trimmed.split(/\s+|\||:/)
        if (parts.length >= 2) {
          key = parts[0].replace(/[:\s|]+$/g, "")
          val = parts.slice(1).join(":").trim()
        } else {
          // only a URL present -> use index-based key
          key = `link_${i + 1}`
          val = trimmed
        }
      } else if (trimmed.includes("|")) {
        const parts = trimmed.split("|")
        key = parts[0].trim()
        val = parts[1] ? parts[1].trim() : ""
      } else if (trimmed.includes(":")) {
        const idx = trimmed.indexOf(":")
        key = trimmed.slice(0, idx).trim()
        val = trimmed.slice(idx + 1).trim()
      } else if (trimmed.includes("=>")) {
        const parts = trimmed.split("=>")
        key = parts[0].trim()
        val = parts[1] ? parts[1].trim() : ""
      } else {
        key = trimmed
        val = ""
      }

      // normalize key (avoid duplicates)
      let normalizedKey = key || `link_${i + 1}`
      let suffix = 1
      while (obj.hasOwnProperty(normalizedKey)) {
        normalizedKey = `${key}_${suffix++}`
      }
      obj[normalizedKey] = val
    })
    return obj
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("access_token")
      const data = new FormData()

      // Build payload fields (but handle notification_preferences & social_links specially)
      // We'll iterate keys but skip these special fields
      const skipKeys = ["certificates", "notification_preferences", "social_links"]
      Object.keys(formData).forEach((key) => {
        if (skipKeys.includes(key)) return

        const val = formData[key]
        if (val === null || val === "") return

        // Files
        if (val instanceof File) {
          data.append(key, val)
          return
        }

        // Arrays -> send as JSON string
        if (Array.isArray(val)) {
          if (val.length > 0) {
            data.append(key, JSON.stringify(val))
          }
          return
        }

        // Objects (non-file) -> stringify
        if (typeof val === "object") {
          data.append(key, JSON.stringify(val))
          return
        }

        // otherwise primitive
        data.append(key, val)
      })

      // notification_preferences: backend expects a dict -> convert array -> object
      const notifObj = arrayToObjectTrue(formData.notification_preferences || notificationPrefs || [])
      // If user had local `notificationPrefs` state, prefer that fallback
      data.append("notification_preferences", JSON.stringify(notifObj))

      // social_links: convert array -> object
      const socialObj = socialLinksArrayToObject(formData.social_links || socialLinks || [])
      data.append("social_links", JSON.stringify(socialObj))

      // Certificates: metadata + files
      // We'll append each certificate file (if present) under the same field name `certificates_files`
      // and send certificates metadata list as `certificates`
      const certificatesMetadata = []
      let fileAppendIndex = 0
      certificates.forEach((cert, index) => {
        const hasFile = cert.file instanceof File
        if (hasFile) {
          // append file(s) as repeated field name (certificates_files)
          data.append("certificates_files", cert.file)
          certificatesMetadata.push({
            name: cert.name || `Certificate ${index + 1}`,
            file_index: fileAppendIndex,
            uploaded_at: new Date().toISOString(),
          })
          fileAppendIndex += 1
        } else {
          // if there's an already uploaded_file_url or just a name
          certificatesMetadata.push({
            name: cert.name || `Certificate ${index + 1}`,
            file_index: null,
            uploaded_at: cert.uploaded_file_url ? null : new Date().toISOString(),
            uploaded_file_url: cert.uploaded_file_url || null,
          })
        }
      })

      if (certificatesMetadata.length > 0) {
        data.append("certificates", JSON.stringify(certificatesMetadata))
      }

      // Debug log (optional) — remove in production
      // for (const [k, v] of data.entries()) console.log(k, v)

      // POST to student profile endpoint (get_or_create in your backend will create or update)
      const response = await axios.post(
        `${API_BASE}/api/auth/student-profile/create/`,
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            // DO NOT set Content-Type — browser sets boundary for FormData
          },
        }
      )

      if (response.status === 201 || response.status === 200) {
        toast.success("Profile updated successfully!")
      } else {
        toast.error("Unexpected response while updating profile.")
        console.error("Unexpected response", response)
      }
    } catch (error) {
      // DRF commonly responds with { errors: { field: [..] } } or plain data
      if (error.response && error.response.data) {
        console.error("Backend error:", error.response.data)
        toast.error("Failed to update profile: " + (error.response.data.message || JSON.stringify(error.response.data)))
      } else {
        console.error(error)
        toast.error("An error occurred while updating your profile.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setIsSubmitting(true)

  //   try {
  //     const token = localStorage.getItem("access_token")
  //     const data = new FormData()

  //     // Add all regular form fields
  //     Object.keys(formData).forEach((key) => {
  //       if (key !== "certificates" && formData[key] !== null && formData[key] !== "") {
  //         if (Array.isArray(formData[key])) {
  //           // Handle arrays - send as JSON string for Django
  //           if (formData[key].length > 0) {
  //             data.append(key, JSON.stringify(formData[key]))
  //           }
  //         } else if (typeof formData[key] === "object" && formData[key] !== null && !(formData[key] instanceof File)) {
  //           // Handle object fields (if any remain)
  //           data.append(key, JSON.stringify(formData[key]))
  //         } else if (formData[key] instanceof File) {
  //           // Handle file uploads
  //           data.append(key, formData[key])
  //         } else {
  //           // Handle regular fields
  //           data.append(key, formData[key])
  //         }
  //       }
  //     })

  //     // Prepare certificates metadata and files
  //     const certificatesMetadata = []
  //     certificates.forEach((cert, index) => {
  //       if (cert.file) {
  //         data.append(`certificate_file_${index}`, cert.file)
  //       }

  //       certificatesMetadata.push({
  //         name: cert.name,
  //         file_index: cert.file ? index : null,
  //         uploaded_at: new Date().toISOString(),
  //       })
  //     })

  //     // Add certificates metadata as JSON
  //     if (certificatesMetadata.length > 0) {
  //       data.append("certificates", JSON.stringify(certificatesMetadata))
  //     }

  //     // Debug: Log what we're sending
  //     console.log("Form data being sent:")
  //     for (const [key, value] of data.entries()) {
  //       console.log(key, value)
  //     }

  //     // Submit the form
  //     const response = await axios.post(`${API_BASE}/api/auth/teacher-profile/create/`, data, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         // Don't set Content-Type header - let browser set it for FormData
  //       },
  //     })

  //     if (response.status === 201) {
  //       toast.success("Profile updated successfully!")
  //     } else {
  //       const errorData = await response.data
  //       console.error("Error response:", errorData)
  //       toast.error(`Failed to update profile: ${JSON.stringify(errorData)}`)
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred while updating your profile.")
  //     console.error(error)
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  if (loading) {
    return <Loader text="Loading Profile..." />
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Student Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateOfBirth} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full Address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education_level">Education Level</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("education_level", value)}
                  value={formData.education_level}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Education Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Institution/University"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_of_study">Field of Study</Label>
                <Input
                  id="field_of_study"
                  name="field_of_study"
                  value={formData.field_of_study}
                  onChange={handleInputChange}
                  placeholder="Field of Study"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  placeholder="Graduation Year"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  name="gpa"
                  type="number"
                  step="0.01"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  placeholder="GPA"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employment_status">Employment Status</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("employment_status", value)}
                  value={formData.employment_status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_job_title">Current Job Title</Label>
                <Input
                  id="current_job_title"
                  name="current_job_title"
                  value={formData.current_job_title}
                  onChange={handleInputChange}
                  placeholder="Current Job Title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="career_goals">Career Goals</Label>
              <Textarea
                id="career_goals"
                name="career_goals"
                value={formData.career_goals}
                onChange={handleInputChange}
                placeholder="Describe your career goals..."
                rows={3}
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Social Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                <Input
                  id="linkedin_profile"
                  name="linkedin_profile"
                  value={formData.linkedin_profile}
                  onChange={handleInputChange}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_profile">GitHub Profile</Label>
                <Input
                  id="github_profile"
                  name="github_profile"
                  value={formData.github_profile}
                  onChange={handleInputChange}
                  placeholder="GitHub URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio_website">Portfolio Website</Label>
                <Input
                  id="portfolio_website"
                  name="portfolio_website"
                  value={formData.portfolio_website}
                  onChange={handleInputChange}
                  placeholder="Portfolio URL"
                />
              </div>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5" />
              Skills & Interests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddSkill} variant="outline">
                    Add
                  </Button>
                </div>
                {skillsList.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        {skill.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="h-4 w-4 p-0 hover:bg-blue-200"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddInterest} variant="outline">
                    Add
                  </Button>
                </div>
                {interestsList.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interestsList.map((interest) => (
                      <div
                        key={interest.id}
                        className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm"
                      >
                        {interest.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInterest(interest.id)}
                          className="h-4 w-4 p-0 hover:bg-green-200"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5" />
              Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Learning Time */}
              <div className="space-y-3">
                <Label>Preferred Learning Time</Label>
                <div className="flex gap-2">
                  <Input
                    value={newPreferredTime}
                    onChange={(e) => setNewPreferredTime(e.target.value)}
                    placeholder="e.g., Morning, Evening"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddPreferredTime} variant="outline">
                    Add
                  </Button>
                </div>
                {preferredLearningTimes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preferredLearningTimes.map((time) => (
                      <div
                        key={time.id}
                        className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm"
                      >
                        {time.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePreferredTime(time.id)}
                          className="h-4 w-4 p-0 hover:bg-purple-200"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Preferences */}
              <div className="space-y-3">
                <Label>Language Preferences</Label>
                <div className="flex gap-2">
                  <Input
                    value={newLanguagePref}
                    onChange={(e) => setNewLanguagePref(e.target.value)}
                    placeholder="e.g., English, Spanish"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddLanguagePref} variant="outline">
                    Add
                  </Button>
                </div>
                {languagePrefs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {languagePrefs.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm"
                      >
                        {lang.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLanguagePref(lang.id)}
                          className="h-4 w-4 p-0 hover:bg-orange-200"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Preferences */}
              <div className="space-y-3">
                <Label>Notification Preferences</Label>
                <div className="flex gap-2">
                  <Input
                    value={newNotificationPref}
                    onChange={(e) => setNewNotificationPref(e.target.value)}
                    placeholder="e.g., Email, SMS"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddNotificationPref} variant="outline">
                    Add
                  </Button>
                </div>
                {notificationPrefs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {notificationPrefs.map((pref) => (
                      <div
                        key={pref.id}
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm"
                      >
                        {pref.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveNotificationPref(pref.id)}
                          className="h-4 w-4 p-0 hover:bg-yellow-200"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <Label>Additional Social Links</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSocialLink}
                    onChange={(e) => setNewSocialLink(e.target.value)}
                    placeholder="e.g., Twitter, Instagram"
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleAddSocialLink} variant="outline">
                    Add
                  </Button>
                </div>
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-sm"
                      >
                        {link.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="h-4 w-4 p-0 hover:bg-indigo-200"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Document Uploads
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Picture */}
              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profile_picture")}
                    className="hidden"
                  />
                  <label htmlFor="profile_picture" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.profile_picture || "Click to upload"}</p>
                  </label>
                </div>
              </div>

              {/* CNIC or Form B Picture */}
              <div className="space-y-2">
                <Label htmlFor="cnic_or_form_b_picture">CNIC or Form B Picture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="cnic_or_form_b_picture"
                    name="cnic_or_form_b_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cnic_or_form_b_picture")}
                    className="hidden"
                  />
                  <label htmlFor="cnic_or_form_b_picture" className="cursor-pointer">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.cnic_or_form_b_picture || "Click to upload"}</p>
                  </label>
                </div>
              </div>

              {/* Degree */}
              <div className="space-y-2">
                <Label htmlFor="degree">Degree Certificate</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="degree"
                    name="degree"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, "degree")}
                    className="hidden"
                  />
                  <label htmlFor="degree" className="cursor-pointer">
                    <GraduationCap className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.degree || "Click to upload"}</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Certificates
            </h3>

            {/* Add New Certificate */}
            <div className="flex gap-2">
              <Input
                value={newCertificateName}
                onChange={(e) => setNewCertificateName(e.target.value)}
                placeholder="Certificate name (e.g., 'JavaScript Certification')"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddCertificate} variant="outline">
                Add Certificate
              </Button>
            </div>

            {/* Certificate List */}
            {certificates.length > 0 && (
              <div className="space-y-3">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{certificate.name}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCertificate(certificate.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Input
                        id={`certificate-${certificate.id}`}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleCertificateFileChange(certificate.id, e.target.files[0])}
                        className="hidden"
                      />
                      <label htmlFor={`certificate-${certificate.id}`} className="cursor-pointer">
                        <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {certificate.file ? certificate.file.name : "Click to upload certificate"}
                        </p>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
