# WebRTC Tutoring System

A comprehensive full-stack online tutoring platform with WebRTC-based video calling, built with Next.js, Node.js signaling server, coturn TURN server, and Django backend integration.

## Architecture

\`\`\`
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js Web   │    │  Node.js Signal  │    │  Django API     │
│   (Frontend)    │◄──►│     Server       │◄──►│   (Backend)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│  coturn TURN    │◄─────────────┘
                        │     Server      │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │  Redis Cache    │
                        │   (Optional)    │
                        └─────────────────┘
\`\`\`

## Features

### Core WebRTC Features
- **Peer-to-Peer Video Calling**: High-quality video/audio communication
- **Screen Sharing**: Share screens for presentations and tutorials
- **Real-time Chat**: Text messaging during video calls
- **Audio/Video Controls**: Mute, camera toggle, volume control
- **TURN Server Support**: NAT traversal for reliable connections

### Meeting Management
- **Multiple Meeting Types**: Instant, scheduled, and lecture meetings
- **Access Control**: Public, private (invite-only), and approval-required meetings
- **Password Protection**: Optional password security for meetings
- **Participant Management**: Host controls, waiting rooms, participant limits
- **Meeting Invitations**: Email invitations with calendar integration

### Advanced Features
- **Django Backend Integration**: Complete API integration with authentication
- **Real-time Notifications**: WebSocket notifications for meeting events
- **Email Notifications**: Automated meeting reminders and invitations
- **Calendar Sync**: Google Calendar integration for scheduled meetings
- **Join Request System**: Approval workflow for restricted meetings
- **Recording Support**: Meeting recording capabilities
- **Responsive Design**: Mobile-first UI with custom brand colors (#313D6A, #F5BB07)

### Production Features
- **Docker Containerization**: Complete containerized deployment
- **Kubernetes Support**: Production-ready K8s manifests
- **Load Balancing**: Multi-instance signaling with Redis
- **SSL/TLS Support**: HTTPS/WSS for secure connections
- **Monitoring & Logging**: Prometheus, Grafana integration
- **Health Checks**: Comprehensive system monitoring

## Quick Start

### Development Setup
\`\`\`bash
# Clone repository
git clone <repository-url>
cd webrtc-tutoring-system

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up --build
\`\`\`

### Access Points
- **Web Frontend**: http://localhost:3000
- **Signaling Server**: ws://localhost:8080/ws
- **Django API**: http://localhost:8000/api
- **TURN Server**: localhost:3478 (STUN/TURN)
- **Redis**: localhost:6379 (if enabled)

## Environment Configuration

### Required Variables
\`\`\`bash
# API Integration
NEXT_PUBLIC_DJANGO_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_SIGNALING_URL=ws://localhost:8080

# Authentication
JWT_SECRET=your-jwt-secret-key
DJANGO_SECRET_KEY=your-django-secret

# TURN Server
TURN_SECRET=your-turn-secret
TURN_REALM=your-domain.com
EXTERNAL_IP=your-public-ip

# Optional Scaling
REDIS_URL=redis://localhost:6379
\`\`\`

### Email Configuration (Django)
\`\`\`bash
# Email settings for notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@your-domain.com
\`\`\`

## Project Structure

\`\`\`
webrtc-tutoring-system/
├── web/                          # Next.js Frontend
│   ├── app/
│   │   ├── meetings/            # Meeting management pages
│   │   │   ├── create/          # Create meeting form
│   │   │   ├── join/            # Join meeting pages
│   │   │   ├── room/            # Meeting room interface
│   │   │   ├── join-requests/   # Join request management
│   │   │   └── invitations/     # Meeting invitations
│   │   └── video-call/          # Video call interface
│   ├── components/
│   │   └── meetings/            # Meeting components
│   │       ├── MeetingRoom.tsx  # Main meeting interface
│   │       ├── VideoTile.tsx    # Video participant display
│   │       ├── MeetingControls.tsx # Audio/video controls
│   │       ├── ChatPanel.tsx    # Real-time chat
│   │       └── ParticipantsPanel.tsx # Participant list
│   ├── hooks/
│   │   └── useWebRTC.ts         # WebRTC management hook
│   └── lib/
│       └── meetingsApi.ts       # Django API client
├── signaling/                    # Node.js Signaling Server
│   ├── server.js               # Main signaling server
│   ├── healthcheck.js          # Health monitoring
│   └── redis-support.md        # Redis scaling guide
├── infra/                       # Infrastructure
│   └── coturn/                 # TURN server configuration
│       ├── turnserver.conf     # Development config
│       ├── turnserver.prod.conf # Production config
│       └── scripts/            # Management scripts
├── django-backend/              # Django Integration
│   └── meetings/
│       └── views.py            # Complete API implementation
├── docs/                        # Documentation
│   ├── installation.md         # Detailed setup guide
│   ├── deployment.md           # Production deployment
│   ├── troubleshooting.md      # Issue resolution
│   └── api.md                  # API documentation
└── docker-compose.yml          # Development orchestration
\`\`\`

## API Integration

### Django Backend Endpoints

**Meeting Management:**
- `POST /api/meeting/create/` - Create meeting with advanced options
- `POST /api/meeting/join/{meeting_id}/` - Join with access control
- `POST /api/meeting/leave/{meeting_id}/` - Leave meeting
- `POST /api/meeting/end/{meeting_id}/` - End meeting (host only)
- `GET /api/meeting/{meeting_id}/participants/` - Get participant list

**Access Control:**
- `POST /api/meeting/join-request/{request_id}/respond/` - Approve/deny join requests
- `POST /api/meeting/invite/{invite_id}/respond/` - Accept/decline invitations
- `POST /api/meeting/{meeting_id}/invite/` - Send meeting invitations

**User Management:**
- `GET /api/meetings/` - Get user's meetings and invitations
- `GET /api/meeting/{meeting_id}/join-request/{request_id}/status/` - Check request status

### WebSocket Signaling Protocol

**Authentication:**
\`\`\`json
{
  "type": "auth",
  "token": "jwt-token-here"
}
\`\`\`

**Meeting Operations:**
\`\`\`json
// Join meeting
{"type": "join", "meetingId": "meeting-uuid", "userId": "user-id"}

// WebRTC Signaling
{"type": "offer", "targetId": "peer-id", "offer": {...}}
{"type": "answer", "targetId": "peer-id", "answer": {...}}
{"type": "ice-candidate", "targetId": "peer-id", "candidate": {...}}

// Chat messages
{"type": "chat", "message": "Hello everyone!", "timestamp": "..."}
\`\`\`

## Deployment Options

### 1. Docker Compose (Single Server)
\`\`\`bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### 2. Kubernetes (Container Orchestration)
\`\`\`bash
# Deploy to Kubernetes
kubectl apply -f k8s/
\`\`\`

### 3. Cloud Platforms
- **AWS**: ECS, EKS, or EC2 deployment
- **Google Cloud**: Cloud Run, GKE deployment
- **Azure**: Container Instances, AKS deployment
- **DigitalOcean**: Droplets with Docker

See [docs/deployment.md](docs/deployment.md) for detailed deployment guides.

## Testing

### Local Development Test
\`\`\`bash
# Start services
docker-compose up

# Test in browser
# 1. Open http://localhost:3000
# 2. Create a meeting
# 3. Open second browser tab/window
# 4. Join the meeting
# 5. Test video/audio/chat/screen sharing
\`\`\`

### Production Readiness Test
\`\`\`bash
# Health checks
./scripts/health-check.sh

# TURN server test
./infra/coturn/scripts/test-turn.sh

# Load testing
# Use tools like Artillery or k6 for WebSocket load testing
\`\`\`

## Monitoring & Observability

### Health Endpoints
- **Web**: `GET /health`
- **Signaling**: `GET /health`
- **TURN**: Custom health check script

### Metrics Collection
- **Prometheus**: System and application metrics
- **Grafana**: Visualization dashboards
- **Custom Metrics**: WebRTC connection statistics

### Logging
- **Structured Logging**: JSON format for all services
- **Centralized Logs**: ELK stack or similar
- **Error Tracking**: Sentry integration ready

## Security Features

### Authentication & Authorization
- **JWT Tokens**: Short-lived tokens (15 minutes)
- **Role-based Access**: Host, co-host, participant roles
- **Meeting Access Control**: Public, private, approval-required
- **Password Protection**: Optional meeting passwords

### Network Security
- **HTTPS/WSS**: All connections encrypted in production
- **TURN Authentication**: Ephemeral credentials
- **Rate Limiting**: WebSocket message throttling
- **CORS Configuration**: Proper cross-origin policies

### Data Protection
- **No Data Storage**: Peer-to-peer communication
- **Temporary Credentials**: Auto-expiring TURN credentials
- **Secure Headers**: Security headers in all responses

## Scaling Considerations

### Horizontal Scaling
- **Multi-instance Signaling**: Redis-backed session sharing
- **Load Balancing**: Session affinity for WebSocket connections
- **Database Scaling**: Read replicas, connection pooling
- **CDN Integration**: Static asset delivery

### Performance Optimization
- **Video Quality Adaptation**: Automatic bitrate adjustment
- **Connection Optimization**: ICE candidate optimization
- **Resource Management**: Container resource limits
- **Caching Strategy**: Redis for session data

### Large Scale Deployments
For deployments beyond 100 concurrent users:
- Consider SFU solutions (LiveKit, mediasoup)
- Implement geographic distribution
- Use dedicated TURN server clusters
- Monitor bandwidth and CPU usage

## Documentation

- **[Installation Guide](docs/installation.md)**: Detailed setup instructions
- **[Deployment Guide](docs/deployment.md)**: Production deployment strategies
- **[Troubleshooting](docs/troubleshooting.md)**: Common issues and solutions
- **[API Documentation](docs/api.md)**: Complete API reference
- **[Architecture Guide](docs/architecture.md)**: System design details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Enterprise Support**: Contact for commercial support options

---

**Built with ❤️ for online education and remote tutoring**
