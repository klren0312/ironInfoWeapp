---
id: rbac-api
title: RBAC API
---

A more friendly API for RBAC. This API is a subset of Management API. The RBAC users could use this API to simplify the code. 

## Reference

global variable `e` is Enforcer instance.

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e := NewEnforcer("examples/rbac_model.conf", "examples/rbac_policy.csv")
```

<!--Node.js-->
```typescript
const e = await newEnforcer('examples/rbac_model.conf', 'examples/rbac_policy.csv')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetRolesForUser()`

GetRolesForUser gets the roles that a user has.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
res := e.GetRolesForUser("alice")
```

<!--Node.js-->
```typescript
const res = e.getRolesForUser('alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetUsersForRole()`

GetUsersForRole gets the users that has a role.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
res := e.GetUsersForRole("data1_admin")
```

<!--Node.js-->
```typescript
const res = e.getUsersForRole('data1_admin')
```
<!--END_DOCUSAURUS_CODE_TABS-->

### `HasRoleForUser()`

HasRoleForUser determines whether a user has a role.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
res := e.HasRoleForUser("alice", "data1_admin")
```

<!--Node.js-->
```typescript
const res = e.hasRoleForUser('alice', 'data1_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `AddRoleForUser()`

AddRoleForUser adds a role for a user.
Returns false if the user already has the role (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.AddRoleForUser("alice", "data2_admin")
```

<!--Node.js-->
```typescript
await e.addRoleForUser('alice', 'data2_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `DeleteRoleForUser()`

DeleteRoleForUser deletes a role for a user.
Returns false if the user does not have the role (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.DeleteRoleForUser("alice", "data1_admin")
```

<!--Node.js-->
```typescript
await e.deleteRoleForUser('alice', 'data1_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `DeleteRolesForUser()`

DeleteRolesForUser deletes all roles for a user.
Returns false if the user does not have any roles (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.DeleteRolesForUser("alice")
```

<!--Node.js-->
```typescript
await e.deleteRolesForUser('alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `DeleteUser()`

DeleteUser deletes a user.
Returns false if the user does not exist (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```
e.DeleteUser("alice")
```

<!--Node.js-->
```typescript
await e.deleteUser('alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `DeleteRole()`

DeleteRole deletes a role.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.DeleteRole("data2_admin")
```

<!--Node.js-->
```typescript
await e.deleteRole("data2_admin")
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `DeletePermission()`

DeletePermission deletes a permission.
Returns false if the permission does not exist (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.DeletePermission("read")
```

<!--Node.js-->
```typescript
await e.deletePermission('read')
```

<!--END_DOCUSAURUS_CODE_TABS-->


### `AddPermissionForUser()`

AddPermissionForUser adds a permission for a user or role.
Returns false if the user or role already has the permission (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.AddPermissionForUser("bob", "read")
```

<!--Node.js-->
```typescript
await e.addPermissionForUser('bob', 'read')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `DeletePermissionForUser()`

DeletePermissionForUser deletes a permission for a user or role.
Returns false if the user or role does not have the permission (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.DeletePermissionForUser("bob", "read")
```

<!--Node.js-->
```typescript
await e.deletePermissionForUser("bob", "read")
```

<!--END_DOCUSAURUS_CODE_TABS-->


### `DeletePermissionsForUser()`

DeletePermissionsForUser deletes permissions for a user or role.
Returns false if the user or role does not have any permissions (aka not affected).

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.DeletePermissionsForUser("bob")
```

<!--Node.js-->
```typescript
await e.deletePermissionsForUser('bob')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetPermissionsForUser()`

GetPermissionsForUser gets permissions for a user or role.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.GetPermissionsForUser("bob")
```

<!--Node.js-->
```typescript
e.getPermissionsForUser('bob')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `HasPermissionForUser()`

HasPermissionForUser determines whether a user has a permission.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.HasPermissionForUser("alice", []string{"read"})
```

<!--Node.js-->
```typescript
e.hasPermissionForUser('alice', 'read')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetImplicitRolesForUser()`

GetImplicitRolesForUser gets implicit roles that a user has.
Compared to GetRolesForUser(), this function retrieves indirect roles besides direct roles.

For example:  
g, alice, role:admin  
g, role:admin, role:user  

GetRolesForUser("alice") can only get: ["role:admin"].  
But GetImplicitRolesForUser("alice") will get: ["role:admin", "role:user"].


For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.GetImplicitRolesForUser("alice")
```

<!--Node.js-->
```text
Method is not implemented
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetImplicitPermissionsForUser()`

GetImplicitPermissionsForUser gets implicit permissions for a user or role.  
Compared to GetPermissionsForUser(), this function retrieves permissions for inherited roles.  

For example:  
p, admin, data1, read  
p, alice, data2, read  
g, alice, admin  

GetPermissionsForUser("alice") can only get: [["alice", "data2", "read"]].  
But GetImplicitPermissionsForUser("alice") will get: [["admin", "data1", "read"], ["alice", "data2", "read"]].

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
e.GetImplicitPermissionsForUser("alice")
```

<!--Node.js-->
```text
Method is not implemented
```

<!--END_DOCUSAURUS_CODE_TABS-->
