"use client"

import { Clock, CheckCircle2, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function WaitingForApproval() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#313D6A" }}>
            <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <Clock size={64} style={{ color: "#F5BB07" }} className="animate-pulse" />
                            <div
                                className="absolute inset-0 rounded-full animate-ping"
                                style={{ backgroundColor: "#F5BB07", opacity: 0.2 }}
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ color: "#F5BB07" }}>
                        Waiting for Admin Approval
                    </h1>

                    <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: "#F5BB07", opacity: 0.9 }}>
                        Your tutor profile has been submitted successfully. Our admin team is currently reviewing your application.
                    </p>

                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle2 size={20} style={{ color: "#F5BB07" }} />
                                <span className="text-sm font-medium" style={{ color: "#F5BB07" }}>
                                    Profile Submitted
                                </span>
                            </div>

                            <div className="flex-1 h-0.5 bg-white/20 mx-2">
                                <div className="h-full animate-pulse" style={{ backgroundColor: "#F5BB07", width: "60%" }} />
                            </div>

                            <div className="flex items-center space-x-2 opacity-60">
                                <User size={20} style={{ color: "#F5BB07" }} />
                                <span className="text-sm font-medium" style={{ color: "#F5BB07" }}>
                                    Admin Review
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-2 mb-6">
                        <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ backgroundColor: "#F5BB07", animationDelay: "0ms" }}
                        />
                        <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ backgroundColor: "#F5BB07", animationDelay: "150ms" }}
                        />
                        <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ backgroundColor: "#F5BB07", animationDelay: "300ms" }}
                        />
                    </div>

                    <div
                        className="text-sm leading-relaxed p-4 rounded-lg bg-white/5 border border-white/10"
                        style={{ color: "#F5BB07", opacity: 0.8 }}
                    >
                        <p className="mb-2">
                            <strong>What happens next?</strong>
                        </p>
                        <p>You'll receive an email notification once your profile is approved. This typically takes 24-48 hours.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
