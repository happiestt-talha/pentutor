const API_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL || "http://127.0.0.1:8000/api"



class MeetingsApiClient {
    baseURL = API_BASE_URL
    token = null

    constructor() {
        this.baseURL = API_BASE_URL
        // Get token from localStorage or your auth system
        if (typeof window !== "undefined") {
            this.token = localStorage.getItem("access_token")
        }
    }

    setAuthToken(token) {
        this.token = token
        if (typeof window !== "undefined") {
            localStorage.setItem("access_token", token)
        }
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`

        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        }

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`
        }

        const response = await fetch(url, {
            ...options,
            headers,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`)
        }

        return response.json()
    }

    async getMeeting(meetingId){
        return this.request(`/meetings/${meetingId}/`)
    }

    async createMeeting(data){
        return this.request("/meetings/create/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`,
            },
            body: JSON.stringify(data),
        })
    }

    async joinMeeting(
        meetingId,
        data,
    ){
        return this.request(`/meetings/join/${meetingId}/`, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async leaveMeeting(
        meetingId,
        guestName,
    ){
        return this.request(`/meetings/leave/${meetingId}/`, {
            method: "POST",
            body: JSON.stringify({ guest_name: guestName }),
        })
    }

    async endMeeting(meetingId){
        return this.request(`/meetings/end/${meetingId}/`, {
            method: "POST",
        })
    }

    async getMeetingParticipants(meetingId){
        return this.request(`/meetings/${meetingId}/participants/`)
    }

    async checkJoinRequestStatus(
        meetingId,
        requestId,
    ){
        return this.request(`/meetings/${meetingId}/join-request/${requestId}/status/`)
    }

    // async getMeetingDetails(meetingId){
    //     return this.request(`/meetings/${meetingId}/`)
    // }

    async getUserMeetings(){
        return this.request("/meetings/")
    }

    async respondToJoinRequest(
        requestId,
        action,
    ){
        return this.request(`/meetings/join-request/${requestId}/respond/`, {
            method: "POST",
            body: JSON.stringify({ action }),
        })
    }

    async respondToInvite(
        inviteId,
        action,
    ){
        return this.request(`/meetings/invite/${inviteId}/respond/`, {
            method: "POST",
            body: JSON.stringify({ action }),
        })
    }

    async sendInvites(
        meetingId,
        emails,
    ){
        return this.request(`/meetings/${meetingId}/invite/`, {
            method: "POST",
            body: JSON.stringify({ action }),
        })
        return this.request(`/meeting/invite/${inviteId}/respond/`, {
            method: "POST",
            body: JSON.stringify({ action }),
        })
    }

    async sendInvites(
        meetingId,
        emails,
    ){
        return this.request(`/meetings/${meetingId}/invite/`, {
            method: "POST",
            body: JSON.stringify({ emails }),
        })
    }
}

export const meetingsApi = new MeetingsApiClient()
