## Architecture

Frontend (React)
→ Backend (Node + Express)
→ Database (PostgreSQL)

## Multi-Tenancy
All tables contain tenant_id for isolation.

## API List
- POST /api/auth/register-tenant
- POST /api/auth/login
- GET /api/auth/me
- POST /api/tenants/:id/users
- GET /api/projects
