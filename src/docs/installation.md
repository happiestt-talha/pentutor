# Installation Guide

This guide covers detailed installation and setup instructions for the WebRTC Tutoring Platform.

## System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB free space
- **Network**: Stable internet connection with open ports

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 20GB+ SSD
- **Network**: High-bandwidth connection for multiple concurrent users

### Software Requirements
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Node.js**: 18+ (for development)
- **Python**: 3.9+ (for Django backend)

## Installation Methods

### Method 1: Docker Compose (Recommended)

#### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd webrtc-tutoring-system
\`\`\`

#### 2. Environment Configuration
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` file:
\`\`\`bash
# Required Settings
DJANGO_API_BASE_URL=http://localhost:8000
SIGNALING_URL=ws://localhost:8080
TURN_SECRET=your-secure-turn-secret
JWT_SECRET=your-jwt-secret-key

# Optional Settings
REDIS_URL=redis://localhost:6379
TURN_REALM=your-domain.com
MAX_PARTICIPANTS=100
\`\`\`

#### 3. Start Services
\`\`\`bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
\`\`\`

#### 4. Verify Installation
\`\`\`bash
# Test web frontend
curl http://localhost:3000

# Test signaling server
curl http://localhost:8080/health

# Test TURN server
./infra/coturn/scripts/test-turn.sh
\`\`\`

### Method 2: Manual Installation

#### 1. Frontend Setup
\`\`\`bash
cd web
npm install

# Development
npm run dev

# Production build
npm run build
npm start
\`\`\`

#### 2. Signaling Server Setup
\`\`\`bash
cd signaling
npm install

# Development
npm run dev

# Production
npm start
\`\`\`

#### 3. TURN Server Setup
\`\`\`bash
# Install coturn
sudo apt-get install coturn

# Copy configuration
sudo cp infra/coturn/turnserver.conf /etc/turnserver.conf

# Start service
sudo systemctl enable coturn
sudo systemctl start coturn
\`\`\`

#### 4. Django Backend Setup
\`\`\`bash
cd django-backend
pip install -r requirements.txt

# Database setup
python manage.py migrate
python manage.py createsuperuser

# Start server
python manage.py runserver
\`\`\`

## Network Configuration

### Port Requirements
- **3000**: Web frontend (HTTP)
- **8080**: Signaling server (WebSocket)
- **3478**: TURN server (STUN/TURN)
- **49152-65535**: TURN server (media relay)
- **8000**: Django API (HTTP)
- **6379**: Redis (optional)

### Firewall Configuration
\`\`\`bash
# Ubuntu/Debian
sudo ufw allow 3000
sudo ufw allow 8080
sudo ufw allow 3478
sudo ufw allow 49152:65535/udp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=3478/tcp
sudo firewall-cmd --permanent --add-port=49152-65535/udp
sudo firewall-cmd --reload
\`\`\`

### NAT/Router Configuration
For production deployments behind NAT:
1. Forward required ports to your server
2. Configure TURN server with external IP
3. Update STUN/TURN server URLs in frontend

## SSL/TLS Configuration

### Development (Self-Signed)
\`\`\`bash
# Generate certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update docker-compose.yml
# Add certificate volumes to services
\`\`\`

### Production (Let's Encrypt)
\`\`\`bash
# Install certbot
sudo apt-get install certbot

# Generate certificates
sudo certbot certonly --standalone -d your-domain.com

# Update configurations with certificate paths
\`\`\`

## Database Setup (Django)

### SQLite (Development)
\`\`\`python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
\`\`\`

### PostgreSQL (Production)
\`\`\`bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb webrtc_tutoring
sudo -u postgres createuser webrtc_user

# Update Django settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'webrtc_tutoring',
        'USER': 'webrtc_user',
        'PASSWORD': 'your-password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
\`\`\`

## Redis Setup (Optional)

### Installation
\`\`\`bash
# Ubuntu/Debian
sudo apt-get install redis-server

# CentOS/RHEL
sudo yum install redis

# Start service
sudo systemctl enable redis
sudo systemctl start redis
\`\`\`

### Configuration
\`\`\`bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf

# Key settings
bind 127.0.0.1
port 6379
maxmemory 256mb
maxmemory-policy allkeys-lru
\`\`\`

## Verification Steps

### 1. Service Health Checks
\`\`\`bash
# Web frontend
curl -f http://localhost:3000 || echo "Frontend not responding"

# Signaling server
curl -f http://localhost:8080/health || echo "Signaling server not responding"

# TURN server
./infra/coturn/scripts/health-check.sh
\`\`\`

### 2. WebRTC Connectivity Test
\`\`\`bash
# Test STUN server
./infra/coturn/scripts/test-turn.sh

# Check NAT type
curl -s https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
\`\`\`

### 3. End-to-End Test
1. Open web frontend in two browser tabs
2. Create a meeting in one tab
3. Join the meeting from the second tab
4. Verify video/audio connection
5. Test screen sharing and chat

## Troubleshooting Installation

### Common Issues

#### Port Already in Use
\`\`\`bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
\`\`\`

#### Permission Denied
\`\`\`bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER .
\`\`\`

#### Network Connectivity
\`\`\`bash
# Test internal connectivity
docker-compose exec web ping signaling
docker-compose exec signaling ping coturn

# Test external connectivity
curl -I https://www.google.com
\`\`\`

#### TURN Server Issues
\`\`\`bash
# Check TURN server logs
sudo journalctl -u coturn -f

# Test TURN connectivity
turnutils_uclient -T -u test -w test your-server-ip
\`\`\`

### Log Locations
- **Docker logs**: `docker-compose logs <service>`
- **System logs**: `/var/log/syslog`
- **Application logs**: `./logs/` directory
- **TURN logs**: `/var/log/turn_*.log`

## Next Steps

After successful installation:
1. Review [API Documentation](api.md)
2. Configure [Deployment](deployment.md) for production
3. Set up [Monitoring](monitoring.md)
4. Read [Architecture Guide](architecture.md)

## Getting Help

If you encounter issues:
1. Check the [Troubleshooting Guide](troubleshooting.md)
2. Review service logs
3. Create an issue on GitHub with:
   - System information
   - Error messages
   - Steps to reproduce
