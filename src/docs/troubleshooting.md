# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the WebRTC Tutoring Platform.

## Quick Diagnostics

### System Health Check
\`\`\`bash
# Run comprehensive health check
./scripts/health-check.sh

# Check individual services
curl -f http://localhost:3000/health    # Web frontend
curl -f http://localhost:8080/health    # Signaling server
./infra/coturn/scripts/test-turn.sh     # TURN server
\`\`\`

### Service Status
\`\`\`bash
# Docker Compose
docker-compose ps
docker-compose logs <service-name>

# Kubernetes
kubectl get pods -n webrtc-tutoring
kubectl logs <pod-name> -n webrtc-tutoring
\`\`\`

## Common Issues

### 1. Connection Issues

#### Problem: Cannot connect to signaling server
**Symptoms:**
- WebSocket connection fails
- "Connection refused" errors
- Frontend shows "Connecting..." indefinitely

**Diagnosis:**
\`\`\`bash
# Check if signaling server is running
curl http://localhost:8080/health

# Check WebSocket connection
wscat -c ws://localhost:8080

# Check network connectivity
telnet localhost 8080
\`\`\`

**Solutions:**
\`\`\`bash
# Restart signaling server
docker-compose restart signaling

# Check firewall settings
sudo ufw status
sudo ufw allow 8080

# Verify environment variables
docker-compose exec signaling env | grep -E "(PORT|JWT_SECRET)"
\`\`\`

#### Problem: WebRTC connection fails
**Symptoms:**
- Video/audio not working
- "Failed to establish peer connection"
- ICE connection state: "failed"

**Diagnosis:**
\`\`\`bash
# Test STUN/TURN server
./infra/coturn/scripts/test-turn.sh

# Check TURN server logs
docker-compose logs coturn

# Test ICE connectivity
# Open browser dev tools -> Console
# Run: pc.getStats().then(stats => console.log(stats))
\`\`\`

**Solutions:**
\`\`\`bash
# Restart TURN server
docker-compose restart coturn

# Check TURN server configuration
docker-compose exec coturn cat /etc/turnserver.conf

# Verify TURN credentials
./infra/coturn/scripts/generate-credentials.sh

# Update STUN/TURN servers in frontend
# Check web/src/hooks/useWebRTC.ts
\`\`\`

### 2. Authentication Issues

#### Problem: JWT authentication fails
**Symptoms:**
- "Invalid token" errors
- Signaling server rejects connections
- 401 Unauthorized responses

**Diagnosis:**
\`\`\`bash
# Check JWT secret configuration
docker-compose exec signaling env | grep JWT_SECRET
docker-compose exec web env | grep JWT_SECRET

# Verify token format
echo "your-jwt-token" | base64 -d
\`\`\`

**Solutions:**
\`\`\`bash
# Ensure JWT secrets match
# Update .env file
JWT_SECRET=your-consistent-secret

# Restart services
docker-compose restart signaling web

# Clear browser storage
# Open browser dev tools -> Application -> Storage -> Clear
\`\`\`

#### Problem: Django API authentication fails
**Symptoms:**
- API returns 403 Forbidden
- User login fails
- Token refresh issues

**Solutions:**
\`\`\`bash
# Check Django settings
python manage.py shell
>>> from django.conf import settings
>>> print(settings.SECRET_KEY)

# Create superuser
python manage.py createsuperuser

# Check database migrations
python manage.py showmigrations
python manage.py migrate
\`\`\`

### 3. Media Issues

#### Problem: Camera/microphone not working
**Symptoms:**
- Black video screen
- No audio transmission
- getUserMedia fails

**Diagnosis:**
\`\`\`javascript
// Test in browser console
navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(stream => console.log('Media access granted', stream))
  .catch(err => console.error('Media access denied', err));

// Check permissions
navigator.permissions.query({name: 'camera'})
  .then(result => console.log('Camera permission:', result.state));
\`\`\`

**Solutions:**
1. **Browser permissions**: Grant camera/microphone access
2. **HTTPS requirement**: Ensure site is served over HTTPS
3. **Device conflicts**: Close other applications using camera/microphone
4. **Browser compatibility**: Use supported browsers (Chrome, Firefox, Safari)

#### Problem: Screen sharing not working
**Symptoms:**
- Screen share button disabled
- getDisplayMedia fails
- Blank screen shared

**Solutions:**
\`\`\`javascript
// Test screen sharing API
navigator.mediaDevices.getDisplayMedia({video: true})
  .then(stream => console.log('Screen sharing available', stream))
  .catch(err => console.error('Screen sharing failed', err));
\`\`\`

1. **Browser support**: Ensure browser supports screen sharing
2. **Permissions**: Grant screen recording permissions (macOS/Windows)
3. **HTTPS**: Screen sharing requires secure context

### 4. Performance Issues

#### Problem: High CPU/memory usage
**Symptoms:**
- Slow video rendering
- Audio/video lag
- Browser becomes unresponsive

**Diagnosis:**
\`\`\`bash
# Check system resources
top
htop
docker stats

# Monitor browser performance
# Open dev tools -> Performance tab
# Record and analyze performance
\`\`\`

**Solutions:**
\`\`\`bash
# Limit video resolution/framerate
# Update useWebRTC.ts constraints:
const constraints = {
  video: {
    width: { max: 640 },
    height: { max: 480 },
    frameRate: { max: 15 }
  },
  audio: true
};

# Increase container resources
# Update docker-compose.yml:
services:
  web:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
\`\`\`

#### Problem: Network bandwidth issues
**Symptoms:**
- Poor video quality
- Frequent disconnections
- High latency

**Solutions:**
1. **Reduce video quality**: Lower resolution/bitrate
2. **Audio-only mode**: Disable video for low bandwidth
3. **TURN server**: Ensure TURN server is geographically close
4. **Network optimization**: Use QoS, prioritize WebRTC traffic

### 5. Docker Issues

#### Problem: Container startup failures
**Symptoms:**
- Services exit immediately
- "Container exited with code 1"
- Port binding errors

**Diagnosis:**
\`\`\`bash
# Check container logs
docker-compose logs <service-name>

# Inspect container
docker-compose exec <service-name> /bin/sh

# Check port conflicts
sudo lsof -i :3000
sudo lsof -i :8080
\`\`\`

**Solutions:**
\`\`\`bash
# Kill conflicting processes
sudo kill -9 <PID>

# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Use different host port

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
\`\`\`

#### Problem: Volume mount issues
**Symptoms:**
- Configuration files not found
- Permission denied errors
- Changes not reflected

**Solutions:**
\`\`\`bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .

# Check volume mounts
docker-compose config

# Recreate volumes
docker-compose down -v
docker-compose up -d
\`\`\`

### 6. Database Issues (Django)

#### Problem: Database connection errors
**Symptoms:**
- "Database connection failed"
- Django 500 errors
- Migration failures

**Diagnosis:**
\`\`\`bash
# Test database connection
python manage.py dbshell

# Check database settings
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
\`\`\`

**Solutions:**
\`\`\`bash
# Reset database
python manage.py flush
python manage.py migrate

# Check database service
docker-compose logs db

# Verify database credentials in settings.py
\`\`\`

### 7. SSL/TLS Issues

#### Problem: Certificate errors
**Symptoms:**
- "Certificate not trusted" warnings
- WebSocket connection fails over HTTPS
- Mixed content errors

**Solutions:**
\`\`\`bash
# Generate new certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Update certificate paths in configuration
# Restart services with new certificates

# For Let's Encrypt
certbot renew
\`\`\`

## Debugging Tools

### Browser Developer Tools
\`\`\`javascript
// WebRTC debugging
// Open dev tools -> Console

// Check peer connection state
console.log('Connection state:', pc.connectionState);
console.log('ICE connection state:', pc.iceConnectionState);
console.log('ICE gathering state:', pc.iceGatheringState);

// Get connection statistics
pc.getStats().then(stats => {
  stats.forEach(report => {
    if (report.type === 'candidate-pair' && report.state === 'succeeded') {
      console.log('Active connection:', report);
    }
  });
});

// Monitor media streams
localStream.getTracks().forEach(track => {
  console.log('Local track:', track.kind, track.enabled, track.readyState);
});
\`\`\`

### Network Analysis
\`\`\`bash
# Monitor network traffic
sudo tcpdump -i any port 3478  # TURN server traffic
sudo tcpdump -i any port 8080  # Signaling server traffic

# Test connectivity
ping your-turn-server.com
telnet your-turn-server.com 3478

# Check DNS resolution
nslookup your-domain.com
dig your-domain.com
\`\`\`

### Log Analysis
\`\`\`bash
# Centralized logging with grep
docker-compose logs | grep -i error
docker-compose logs | grep -i "connection failed"

# Real-time log monitoring
docker-compose logs -f signaling | grep -i webrtc

# Log rotation and analysis
logrotate /etc/logrotate.d/webrtc-tutoring
\`\`\`

## Performance Monitoring

### System Metrics
\`\`\`bash
# CPU and memory usage
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Network usage
iftop -i eth0

# Disk I/O
iotop
\`\`\`

### Application Metrics
\`\`\`javascript
// Frontend performance monitoring
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});
observer.observe({entryTypes: ['measure', 'navigation']});

// WebRTC statistics
setInterval(async () => {
  const stats = await pc.getStats();
  stats.forEach(report => {
    if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
      console.log(`Video bitrate: ${report.bytesReceived * 8 / 1000} kbps`);
    }
  });
}, 5000);
\`\`\`

## Getting Help

### Information to Collect
When reporting issues, include:

1. **System information**:
   \`\`\`bash
   uname -a
   docker --version
   docker-compose --version
   \`\`\`

2. **Service logs**:
   \`\`\`bash
   docker-compose logs > logs.txt
   \`\`\`

3. **Configuration**:
   \`\`\`bash
   docker-compose config > config.yml
   \`\`\`

4. **Network information**:
   \`\`\`bash
   ip addr show
   netstat -tlnp
   \`\`\`

5. **Browser information**:
   - Browser version
   - Console errors
   - Network tab errors

### Support Channels
- **GitHub Issues**: Create detailed issue reports
- **Documentation**: Check docs/ directory
- **Community**: Join discussions
- **Professional Support**: Contact for enterprise support

### Emergency Procedures
\`\`\`bash
# Quick service restart
docker-compose restart

# Full system restart
docker-compose down
docker-compose up -d

# Emergency rollback
git checkout previous-working-commit
docker-compose build
docker-compose up -d
\`\`\`

This troubleshooting guide covers the most common issues you might encounter. For specific problems not covered here, check the logs and create a detailed issue report.
