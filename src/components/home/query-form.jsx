"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// shadcn Select composed components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Loader2 } from "lucide-react"
import { FaArrowRightLong } from "react-icons/fa6"

export default function QueryFormShadcn() {
    const router = useRouter()
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    const [formData, setFormData] = useState({
        name: "",
        area: "",
        classLevel: "",
        subjects: "",
        email: "",
        contact: "",
        requirements: "",
    })

    const [loading, setLoading] = useState(false)

    const grades = [
        "Nursery",
        "KG",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "Other",
    ]

  const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((s) => ({ ...s, [name]: value }))
    }

    const handleSelectChange = (field) => (value) => {
        setFormData((s) => ({ ...s, [field]: value }))
    }

    const validate = () => {
        if (!formData.name.trim()) return "Please enter your full name."
        if (!formData.email.trim()) return "Please enter your email."
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(formData.email)) return "Please enter a valid email."
        if (!formData.contact.trim()) return "Please enter a contact number."
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const err = validate()
        if (err) {
            toast.error(err)
            return
        }

        setLoading(true)
        try {
            const payload = {
                full_name: formData.name,
                area: formData.area,
                class: formData.classLevel,
                subjects: formData.subjects,
                email: formData.email,
                contact_no: formData.contact,
                requirements: formData.requirements,
            }

            await axios.post(`${API_BASE}/api/queries/`, payload)
            toast.success("Query submitted successfully")
            setFormData({
                name: "",
                area: "",
                classLevel: "",
                subjects: "",
                email: "",
                contact: "",
                requirements: "",
            })
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit query")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="bg-slate-800 py-10">
            <div className="container mx-auto px-4">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto rounded-2xl shadow-lg"
                >
                    <h3 className="text-white text-2xl text-center font-semibold mb-4">Student Query Form</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-white">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-white"
                                required
                            />
                        </div>

                        {/* Area */}
                        <div className="space-y-1">
                            <Label htmlFor="area" className="text-white">Area</Label>
                            <Input
                                id="area"
                                name="area"
                                placeholder="e.g., Gulberg, DHA"
                                value={formData.area}
                                onChange={handleChange}
                                className="bg-white"
                            />
                        </div>

                        {/* Class */}
                        <div className="space-y-1">
                            <Label htmlFor="classLevel" className="text-white">Class / Grade</Label>
                            <Select
                                onValueChange={handleSelectChange("classLevel")}
                                defaultValue={formData.classLevel}
                                className="w-full"
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grades.map((grade) => (
                                        <SelectItem key={grade} value={grade}>
                                            {grade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subjects (span 2 on lg) */}
                        <div className=" space-y-1">
                            <Label htmlFor="subjects" className="text-white">Subjects</Label>
                            <Input
                                id="subjects"
                                name="subjects"
                                placeholder="e.g., Math, Physics (comma separated)"
                                value={formData.subjects}
                                onChange={handleChange}
                                className="bg-white"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-white"
                                required
                            />
                        </div>

                        {/* Contact No */}
                        <div className="space-y-1">
                            <Label htmlFor="contact" className="text-white">Contact No</Label>
                            <Input
                                id="contact"
                                name="contact"
                                type="tel"
                                placeholder="+92 3XX XXXXXXX"
                                value={formData.contact}
                                onChange={handleChange}
                                className="bg-white"
                                required
                                inputMode="tel"
                            />
                        </div>

                        {/* Special requirements full width */}
                        <div className="md:col-span-2 lg:col-span-3 space-y-1">
                            <Label htmlFor="requirements" className="text-white">Any special requirements</Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                placeholder="Mention timing, preferred tutor gender, accessibility needs, etc."
                                value={formData.requirements}
                                onChange={handleChange}
                                className="bg-white text-slate-900"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <Button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-5 py-3 flex items-center gap-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Query</span>
                                    <FaArrowRightLong className="h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
