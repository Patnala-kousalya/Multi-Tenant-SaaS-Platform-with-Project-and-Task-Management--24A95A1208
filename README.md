# Multi-Tenant SaaS Platform – Project & Task Management

## 📌 Description
This is a production-ready Multi-Tenant SaaS application where multiple organizations
can register, manage users, create projects, and track tasks with complete data isolation.
The system uses JWT authentication, role-based access control, and Dockerized deployment.

---

## 🚀 Features
- Multi-tenant architecture with tenant isolation
- Tenant registration with unique subdomain
- JWT-based authentication
- Role-based access control (Super Admin, Tenant Admin, User)
- User management per tenant
- Project creation and management
- Task management within projects
- Subscription plan limits (Free / Pro / Enterprise)
- Dockerized backend, frontend, and database
- Health check API

---

## 🛠 Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt

### Frontend
- React.js
- Axios

### DevOps
- Docker
- Docker Compose

---

## 🧱 Architecture Overview
Frontend communicates with Backend API.
Backend handles authentication, authorization, and business logic.
PostgreSQL stores tenant-isolated data using tenant_id.

---

## ⚙️ Installation & Setup

### Prerequisites
- Docker
- Docker Compose
- Node.js (for local development)

### Run Application
docker-compose up -d

### Access URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health
## Backend URL
http://localhost:5000

## Frontend URL
http://localhost:3000

---

## 🔐 Environment Variables

DB_HOST=database  
DB_PORT=5432  
DB_NAME=saas_db  
DB_USER=postgres  
DB_PASSWORD=postgres  
JWT_SECRET=dev_secret_key  
PORT=5000  
FRONTEND_URL=http://frontend:3000  

---

## 📡 API Overview
- POST /api/auth/register-tenant
- POST /api/auth/login
- GET /api/auth/me
- POST /api/tenants/:tenantId/users
- GET /api/projects
- POST /api/projects

---

## 📄 Documentation
All design and research documents are available in the `docs/` folder:
- research.md
- PRD.md
- architecture.md
- technical-spec.md

---

## 📦 Docker
All services (database, backend, frontend) run using:
docker-compose up -d

---

## 🎯 Conclusion
This project demonstrates secure multi-tenancy, scalable architecture,
and full-stack SaaS development with Dockerized deployment.
