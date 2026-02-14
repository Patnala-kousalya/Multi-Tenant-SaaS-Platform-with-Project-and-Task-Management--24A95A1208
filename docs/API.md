# API Documentation

## Auth APIs
POST /api/auth/register-tenant
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout

## Tenant APIs
GET /api/tenants/:tenantId
PUT /api/tenants/:tenantId
GET /api/tenants

## Users
POST /api/tenants/:tenantId/users
GET /api/tenants/:tenantId/users
PUT /api/users/:userId
DELETE /api/users/:userId

## Projects
POST /api/projects
GET /api/projects
PUT /api/projects/:projectId
DELETE /api/projects/:projectId

## Tasks
POST /api/projects/:projectId/tasks
GET /api/projects/:projectId/tasks
PATCH /api/tasks/:taskId/status
PUT /api/tasks/:taskId
