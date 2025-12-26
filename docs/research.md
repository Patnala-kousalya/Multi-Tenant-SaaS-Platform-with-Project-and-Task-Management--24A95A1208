## Multi-Tenancy Approaches

1. Shared Database + Shared Schema
- Single database
- tenant_id column
- Low cost
- Easy to manage

2. Shared Database + Separate Schema
- Separate schema per tenant
- Better isolation
- More complex

3. Separate Database per Tenant
- Best isolation
- Very expensive
- Hard to scale

### Chosen Approach
We used Shared Database + Shared Schema with tenant_id because:
- Easy to scale
- Cost effective
- Simple to implement
