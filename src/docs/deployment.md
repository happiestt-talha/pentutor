# Deployment Guide

This guide covers production deployment strategies for the WebRTC Tutoring Platform.

## Deployment Options

### 1. Docker Compose (Single Server)
### 2. Kubernetes (Container Orchestration)
### 3. Cloud Platforms (AWS, GCP, Azure)
### 4. Manual Deployment

## Docker Compose Production

### Production Configuration
\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile.prod
    ports:
      - "80:3000"
      - "443:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SIGNALING_URL=wss://your-domain.com:8080
      - NEXT_PUBLIC_DJANGO_API_BASE_URL=https://api.your-domain.com
    volumes:
      - ./ssl:/app/ssl:ro
    restart: unless-stopped

  signaling:
    build:
      context: ./signaling
      dockerfile: Dockerfile.prod
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=${REDIS_URL}
    restart: unless-stopped

  coturn:
    build:
      context: ./infra/coturn
    ports:
      - "3478:3478"
      - "3478:3478/udp"
      - "49152-65535:49152-65535/udp"
    environment:
      - TURN_SECRET=${TURN_SECRET}
      - TURN_REALM=${TURN_REALM}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
\`\`\`

### SSL/TLS Setup
\`\`\`bash
# Generate Let's Encrypt certificates
certbot certonly --standalone -d your-domain.com -d api.your-domain.com

# Copy certificates
mkdir -p ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/

# Deploy with SSL
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Load Balancer Configuration
\`\`\`nginx
# nginx.conf
upstream web_backend {
    server localhost:3000;
}

upstream signaling_backend {
    server localhost:8080;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-domain.com.pem;
    ssl_certificate_key /etc/ssl/private/your-domain.com.key;

    location / {
        proxy_pass http://web_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws {
        proxy_pass http://signaling_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

## Kubernetes Deployment

### Namespace and ConfigMap
\`\`\`yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: webrtc-tutoring

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: webrtc-tutoring
data:
  SIGNALING_URL: "wss://signaling.your-domain.com"
  DJANGO_API_BASE_URL: "https://api.your-domain.com"
  TURN_REALM: "your-domain.com"
\`\`\`

### Web Frontend Deployment
\`\`\`yaml
# k8s/web-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-frontend
  namespace: webrtc-tutoring
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-frontend
  template:
    metadata:
      labels:
        app: web-frontend
    spec:
      containers:
      - name: web
        image: webrtc-tutoring/web:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
apiVersion: v1
kind: Service
metadata:
  name: web-service
  namespace: webrtc-tutoring
spec:
  selector:
    app: web-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
\`\`\`

### Signaling Server Deployment
\`\`\`yaml
# k8s/signaling-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: signaling-server
  namespace: webrtc-tutoring
spec:
  replicas: 2
  selector:
    matchLabels:
      app: signaling-server
  template:
    metadata:
      labels:
        app: signaling-server
    spec:
      containers:
      - name: signaling
        image: webrtc-tutoring/signaling:latest
        ports:
        - containerPort: 8080
        env:
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: signaling-service
  namespace: webrtc-tutoring
spec:
  selector:
    app: signaling-server
  ports:
  - port: 8080
    targetPort: 8080
  sessionAffinity: ClientIP
\`\`\`

### TURN Server Deployment
\`\`\`yaml
# k8s/coturn-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coturn-server
  namespace: webrtc-tutoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: coturn-server
  template:
    metadata:
      labels:
        app: coturn-server
    spec:
      containers:
      - name: coturn
        image: webrtc-tutoring/coturn:latest
        ports:
        - containerPort: 3478
        - containerPort: 3478
          protocol: UDP
        env:
        - name: TURN_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: turn-secret
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: coturn-service
  namespace: webrtc-tutoring
spec:
  selector:
    app: coturn-server
  ports:
  - name: turn-tcp
    port: 3478
    targetPort: 3478
    protocol: TCP
  - name: turn-udp
    port: 3478
    targetPort: 3478
    protocol: UDP
  type: LoadBalancer
\`\`\`

### Ingress Configuration
\`\`\`yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webrtc-ingress
  namespace: webrtc-tutoring
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/websocket-services: signaling-service
spec:
  tls:
  - hosts:
    - your-domain.com
    - signaling.your-domain.com
    secretName: webrtc-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
  - host: signaling.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: signaling-service
            port:
              number: 8080
\`\`\`

## Cloud Platform Deployments

### AWS Deployment

#### ECS with Fargate
\`\`\`yaml
# aws/task-definition.json
{
  "family": "webrtc-tutoring",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "your-account.dkr.ecr.region.amazonaws.com/webrtc-web:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/webrtc-tutoring",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
\`\`\`

#### Application Load Balancer
\`\`\`bash
# Create ALB
aws elbv2 create-load-balancer \
  --name webrtc-alb \
  --subnets subnet-12345 subnet-67890 \
  --security-groups sg-12345

# Create target group
aws elbv2 create-target-group \
  --name webrtc-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-12345 \
  --target-type ip
\`\`\`

### Google Cloud Platform

#### Cloud Run Deployment
\`\`\`yaml
# gcp/service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: webrtc-web
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 100
      containers:
      - image: gcr.io/your-project/webrtc-web:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
\`\`\`

### Azure Container Instances
\`\`\`yaml
# azure/container-group.yaml
apiVersion: 2019-12-01
location: eastus
name: webrtc-tutoring
properties:
  containers:
  - name: web
    properties:
      image: your-registry.azurecr.io/webrtc-web:latest
      ports:
      - port: 3000
        protocol: TCP
      resources:
        requests:
          cpu: 1
          memoryInGB: 1
  - name: signaling
    properties:
      image: your-registry.azurecr.io/webrtc-signaling:latest
      ports:
      - port: 8080
        protocol: TCP
      resources:
        requests:
          cpu: 0.5
          memoryInGB: 0.5
  osType: Linux
  ipAddress:
    type: Public
    ports:
    - port: 3000
      protocol: TCP
    - port: 8080
      protocol: TCP
type: Microsoft.ContainerInstance/containerGroups
\`\`\`

## Monitoring and Logging

### Prometheus Configuration
\`\`\`yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'webrtc-web'
    static_configs:
      - targets: ['web:3000']
    metrics_path: '/metrics'

  - job_name: 'webrtc-signaling'
    static_configs:
      - targets: ['signaling:8080']
    metrics_path: '/metrics'

  - job_name: 'coturn'
    static_configs:
      - targets: ['coturn:3478']
\`\`\`

### Grafana Dashboard
\`\`\`json
{
  "dashboard": {
    "title": "WebRTC Tutoring Platform",
    "panels": [
      {
        "title": "Active Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "webrtc_active_connections",
            "legendFormat": "Active Connections"
          }
        ]
      },
      {
        "title": "Meeting Duration",
        "type": "graph",
        "targets": [
          {
            "expr": "webrtc_meeting_duration_seconds",
            "legendFormat": "Meeting Duration"
          }
        ]
      }
    ]
  }
}
\`\`\`

## Security Considerations

### Network Security
- Use HTTPS/WSS for all connections
- Configure proper CORS policies
- Implement rate limiting
- Use VPN for internal communications

### Application Security
- Validate all inputs
- Implement proper authentication
- Use secure JWT tokens
- Regular security updates

### Infrastructure Security
- Keep systems updated
- Use security groups/firewalls
- Monitor for intrusions
- Regular backups

## Performance Optimization

### Scaling Strategies
1. **Horizontal scaling**: Multiple instances behind load balancer
2. **Database optimization**: Connection pooling, read replicas
3. **CDN integration**: Static asset delivery
4. **Caching**: Redis for session data

### Resource Optimization
- Container resource limits
- Database query optimization
- Image optimization
- Code splitting

## Backup and Recovery

### Database Backup
\`\`\`bash
# PostgreSQL backup
pg_dump -h localhost -U webrtc_user webrtc_tutoring > backup.sql

# Restore
psql -h localhost -U webrtc_user webrtc_tutoring < backup.sql
\`\`\`

### File System Backup
\`\`\`bash
# Create backup
tar -czf webrtc-backup-$(date +%Y%m%d).tar.gz \
  /opt/webrtc-tutoring \
  /etc/nginx \
  /etc/ssl

# Restore
tar -xzf webrtc-backup-20231201.tar.gz -C /
\`\`\`

## Maintenance

### Regular Tasks
- Monitor system resources
- Update dependencies
- Review logs for errors
- Test backup/recovery procedures
- Security patches

### Health Checks
\`\`\`bash
#!/bin/bash
# health-check.sh

# Check web frontend
curl -f http://localhost:3000/health || echo "Web frontend down"

# Check signaling server
curl -f http://localhost:8080/health || echo "Signaling server down"

# Check TURN server
turnutils_uclient -T -u test -w test localhost || echo "TURN server down"
\`\`\`

This deployment guide provides comprehensive instructions for various deployment scenarios. Choose the method that best fits your infrastructure and requirements.
