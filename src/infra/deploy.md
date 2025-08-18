# Production Deployment Guide

This guide covers deploying the WebRTC Tutoring System to production on a VPS (DigitalOcean, Hetzner, etc.).

## Prerequisites

- Ubuntu 20.04+ VPS with at least 2GB RAM
- Domain name with DNS pointing to your server
- Root or sudo access

## 1. Server Setup

### Initial Server Configuration

\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx ufw git

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
\`\`\`

### Firewall Configuration

\`\`\`bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3478/tcp
sudo ufw allow 3478/udp
sudo ufw allow 5349/tcp
sudo ufw allow 5349/udp
sudo ufw allow 49152:65535/udp
sudo ufw enable
\`\`\`

## 2. Application Deployment

### Clone and Configure

\`\`\`bash
# Clone repository
git clone <your-repo-url> /opt/webrtc-tutoring
cd /opt/webrtc-tutoring

# Create production environment file
cp .env.example .env.prod

# Edit production configuration
nano .env.prod
\`\`\`

### Production Environment Variables

\`\`\`bash
# .env.prod
NODE_ENV=production
DJANGO_API_BASE_URL=https://pen-tutor-api.onrender.com
SIGNALING_URL=wss://signaling.yourdomain.com/ws
SIGNALING_JWT_SECRET=your-super-secure-jwt-secret-change-this
EXTERNAL_IP=YOUR_SERVER_PUBLIC_IP
TURN_SECRET=your-super-secure-turn-secret
REALM=yourdomain.com
REDIS_URL=redis://redis:6379
\`\`\`

### Docker Compose Production

\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_DJANGO_API_BASE_URL=${DJANGO_API_BASE_URL}
      - NEXT_PUBLIC_SIGNALING_URL=${SIGNALING_URL}
    networks:
      - webrtc-network

  signaling:
    build:
      context: ./signaling
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=8080
      - SIGNALING_JWT_SECRET=${SIGNALING_JWT_SECRET}
      - DJANGO_API_BASE_URL=${DJANGO_API_BASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis
    networks:
      - webrtc-network

  coturn:
    image: instrumentisto/coturn:latest
    restart: unless-stopped
    ports:
      - "3478:3478/tcp"
      - "3478:3478/udp"
      - "5349:5349/tcp"
      - "5349:5349/udp"
      - "49152-65535:49152-65535/udp"
    environment:
      - EXTERNAL_IP=${EXTERNAL_IP}
      - TURN_SECRET=${TURN_SECRET}
      - REALM=${REALM}
    volumes:
      - ./infra/coturn/turnserver.prod.conf:/etc/coturn/turnserver.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    command: ["-c", "/etc/coturn/turnserver.conf"]
    networks:
      - webrtc-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - webrtc-network

volumes:
  redis_data:

networks:
  webrtc-network:
    driver: bridge
\`\`\`

## 3. Nginx Configuration

### Main Nginx Config

\`\`\`nginx
# /etc/nginx/sites-available/webrtc-tutoring
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Signaling server
server {
    listen 443 ssl http2;
    server_name signaling.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    location /health {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
    }
}
\`\`\`

### Enable Site

\`\`\`bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/webrtc-tutoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

## 4. SSL Certificate Setup

\`\`\`bash
# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d signaling.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
\`\`\`

## 5. Start Services

\`\`\`bash
# Start the application
cd /opt/webrtc-tutoring
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
\`\`\`

## 6. Systemd Service (Optional)

Create a systemd service for automatic startup:

\`\`\`ini
# /etc/systemd/system/webrtc-tutoring.service
[Unit]
Description=WebRTC Tutoring System
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/webrtc-tutoring
ExecStart=/usr/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
# Enable and start service
sudo systemctl enable webrtc-tutoring.service
sudo systemctl start webrtc-tutoring.service
\`\`\`

## 7. Monitoring and Logging

### Log Management

\`\`\`bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f signaling
docker-compose -f docker-compose.prod.yml logs -f web

# Setup log rotation
sudo nano /etc/logrotate.d/webrtc-tutoring
\`\`\`

### Health Checks

\`\`\`bash
# Check service status
curl https://signaling.yourdomain.com/health
curl https://yourdomain.com

# Check TURN server
turnutils_stunclient signaling.yourdomain.com 3478
\`\`\`

## 8. Backup Strategy

\`\`\`bash
# Backup script
#!/bin/bash
# /opt/backup-webrtc.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"

mkdir -p $BACKUP_DIR

# Backup Redis data
docker exec webrtc-tutoring_redis_1 redis-cli BGSAVE
docker cp webrtc-tutoring_redis_1:/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# Backup configuration
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /opt/webrtc-tutoring/.env.prod /etc/nginx/sites-available/webrtc-tutoring

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
\`\`\`

## 9. Security Hardening

### Additional Security Measures

\`\`\`bash
# Install fail2ban
sudo apt install fail2ban

# Configure fail2ban for nginx
sudo nano /etc/fail2ban/jail.local
\`\`\`

\`\`\`ini
[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
\`\`\`

### Regular Updates

\`\`\`bash
# Create update script
#!/bin/bash
# /opt/update-webrtc.sh

cd /opt/webrtc-tutoring
git pull origin main
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
docker system prune -f
\`\`\`

## 10. Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check firewall rules
   - Verify Nginx WebSocket proxy configuration
   - Check SSL certificate validity

2. **TURN Server Not Working**
   - Verify UDP ports are open
   - Check EXTERNAL_IP configuration
   - Test with STUN/TURN testing tools

3. **High CPU Usage**
   - Monitor with `htop` and `docker stats`
   - Consider scaling with multiple signaling instances
   - Implement Redis for session storage

### Performance Monitoring

\`\`\`bash
# Monitor system resources
htop
docker stats

# Monitor network connections
netstat -tulpn | grep :3478
netstat -tulpn | grep :8080
\`\`\`

This deployment guide provides a production-ready setup for the WebRTC Tutoring System with proper security, monitoring, and backup procedures.
