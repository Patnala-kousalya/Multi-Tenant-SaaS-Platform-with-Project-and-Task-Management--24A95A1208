-- Enable uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- TENANT
-- =========================
INSERT INTO tenants (
    id, name, subdomain, status, subscription_plan, max_users, max_projects
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15
) ON CONFLICT DO NOTHING;

-- =========================
-- SUPER ADMIN (tenant_id = NULL)
-- Password: Admin@123
-- =========================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    NULL,
    'superadmin@system.com',
    '$2b$10$E6l6Zq6vNQxJk9Hjv2u5OeZ0n4nYxLz8B9rYpQJ4Z0s5m8ZxQnH2u',
    'System Super Admin',
    'super_admin'
) ON CONFLICT DO NOTHING;

-- =========================
-- TENANT ADMIN
-- Password: Demo@123
-- =========================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'admin@demo.com',
    '$2b$10$6uP1nFZ9lK9cM5F7xqJ8T.e2R4Zc1ZxYpN9JxJQ0R5u9vL3Q5T3K',
    'Demo Admin',
    'tenant_admin'
) ON CONFLICT DO NOTHING;

-- =========================
-- REGULAR USERS
-- Password: User@123
-- =========================
INSERT INTO users (
    id, tenant_id, email, password_hash, full_name, role
) VALUES
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'user1@demo.com',
    '$2b$10$7Fh9YcZ3Xk2H9uR5m9JZzK2F8FQZQ7TzGmPZxX9RZp5Y8ZJZy',
    'Demo User One',
    'user'
),
(
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'user2@demo.com',
    '$2b$10$7Fh9YcZ3Xk2H9uR5m9JZzK2F8FQZQ7TzGmPZxX9RZp5Y8ZJZy',
    'Demo User Two',
    'user'
) ON CONFLICT DO NOTHING;

-- =========================
-- PROJECTS
-- =========================
INSERT INTO projects (
    id, tenant_id, name, description, created_by
) VALUES
(
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Project Alpha',
    'First demo project',
    '33333333-3333-3333-3333-333333333333'
),
(
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    'Project Beta',
    'Second demo project',
    '33333333-3333-3333-3333-333333333333'
) ON CONFLICT DO NOTHING;

-- =========================
-- TASKS
-- =========================
INSERT INTO tasks (
    id, project_id, tenant_id, title, priority
) VALUES
(
    '88888888-8888-8888-8888-888888888888',
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Design Homepage',
    'high'
),
(
    '99999999-9999-9999-9999-999999999999',
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    'Setup Backend',
    'medium'
) ON CONFLICT DO NOTHING;

