## Reference

global variable `e` is Enforcer instance.

<!--DOCUSAURUS_CODE_TABS-->

<!--Node.js-->
```typescript
const e = await newEnforcer('examples/rbac_model.conf', 'examples/rbac_policy.csv')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllSubjects()`

GetAllSubjects gets the list of subjects that show up in the current policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--Node.js-->
```typescript
const allSubjects = e.getAllSubjects()
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllNamedSubjects()`

GetAllNamedSubjects gets the list of subjects that show up in the current named policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--Node.js-->
```typescript
const allNamedSubjects = e.getAllNamedSubjects('p')
```
<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllObjects()`

GetAllObjects gets the list of objects that show up in the current policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--Node.js-->
```typescript
const allObjects = e.getAllObjects()
// [ 'anonymous', 'superAdmin', 'tour' ]
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllNamedObjects()`

GetAllNamedObjects gets the list of objects that show up in the current named policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--Node.js-->
```typescript
const allNamedObjects = e.getAllNamedObjects('p')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllActions()`

GetAllActions gets the list of actions that show up in the current policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--Node.js-->
```typescript
const allActions = e.getAllActions()
// [ '/',
//   '*',
//   '/weapp',
//   '/login',
//   '/user/login',
//   '/api/v1/user/login',
//   '/api/v1/weapp',
//   '/api/v1/article',
//   '/api/v1/wechatUser',
//   '/api/v1/homeSum',
//   '/api/v1/iron',
//   '/api/v1/hot' ]
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllNamedActions()`

GetAllNamedActions gets the list of actions that show up in the current named policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
allNamedActions := e.GetAllNamedActions("p")
```

<!--Node.js-->
```typescript
const allNamedActions = e.getAllNamedActions('p')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllRoles()`

GetAllRoles gets the list of roles that show up in the current policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```
allRoles = e.GetAllRoles()

```

<!--Node.js-->
```typescript
const allRoles = e.getAllRoles()
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetAllNamedRoles()`

GetAllNamedRoles gets the list of roles that show up in the current named policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
allNamedRoles := e.GetAllNamedRoles("g")

```

<!--Node.js-->
```typescript
const allNamedRoles = e.getAllNamedRoles('g')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetPolicy()`

GetPolicy gets all the authorization rules in the policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
policy = e.GetPolicy()
```

<!--Node.js-->
```typescript
const policy = e.getPolicy()
```

<!--END_DOCUSAURUS_CODE_TABS-->


### `GetFilteredPolicy()`

GetFilteredPolicy gets all the authorization rules in the policy, field filters can be specified.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
filteredPolicy := e.GetFilteredPolicy(0, "alice")
```

<!--Node.js-->
```typescript
const filteredPolicy = e.getFilteredPolicy(0, 'alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetNamedPolicy()`

GetNamedPolicy gets all the authorization rules in the named policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
namedPolicy := e.GetNamedPolicy("p")
```

<!--Node.js-->
```typescript
const namedPolicy = e.getNamedPolicy('p')
```

<!--END_DOCUSAURUS_CODE_TABS-->


### `GetFilteredNamedPolicy()`

GetFilteredNamedPolicy gets all the authorization rules in the named policy, field filters can be specified.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
filteredNamedPolicy = e.GetFilteredNamedPolicy("p", 0, "bob")
```

<!--Node.js-->
```typescript
const filteredNamedPolicy = e.getFilteredNamedPolicy('p', 0, 'bob')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetGroupingPolicy()`

GetGroupingPolicy gets all the role inheritance rules in the policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
groupingPolicy := e.GetGroupingPolicy()
```

<!--Node.js-->
```typescript
const groupingPolicy = e.getGroupingPolicy()
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetFilteredGroupingPolicy()`

GetFilteredGroupingPolicy gets all the role inheritance rules in the policy, field filters can be specified.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
filteredGroupingPolicy := e.GetFilteredGroupingPolicy(0, "alice")

```

<!--Node.js-->
```typescript
const filteredGroupingPolicy = e.getFilteredGroupingPolicy(0, 'alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetNamedGroupingPolicy()`

GetNamedGroupingPolicy gets all the role inheritance rules in the policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
namedGroupingPolicy := e.GetNamedGroupingPolicy("g")
```

<!--Node.js-->
```typescript
const namedGroupingPolicy = e.getNamedGroupingPolicy('g')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `GetFilteredNamedGroupingPolicy()`

GetFilteredNamedGroupingPolicy gets all the role inheritance rules in the policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
namedGroupingPolicy := e.GetFilteredNamedGroupingPolicy("g", 0, "alice")
```

<!--Node.js-->
```typescript
const namedGroupingPolicy = e.getFilteredNamedGroupingPolicy('g', 0, 'alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `HasPolicy()`

HasPolicy determines whether an authorization rule exists.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
hasPolicy := e.HasPolicy("data2_admin", "data2", "read")
```

<!--Node.js-->
```typescript
const hasPolicy = e.hasPolicy('data2_admin', 'data2', 'read')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `HasNamedPolicy()`

HasNamedPolicy determines whether a named authorization rule exists.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
hasNamedPolicy := e.HasNamedPolicy("p", "data2_admin", "data2", "read")
```

<!--Node.js-->
```typescript
const hasNamedPolicy = e.hasNamedPolicy('p', 'data2_admin', 'data2', 'read')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `AddPolicy()`

AddPolicy adds an authorization rule to the current policy.
If the rule already exists, the function returns false and the rule will not be added.
Otherwise the function returns true by adding the new rule.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
added := e.AddPolicy("eve", "data3", "read")
```

<!--Node.js-->
```typescript
const p = ['eve', 'data3', 'read']
const added = await e.addPolicy(...p)
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `AddNamedPolicy()`

AddNamedPolicy adds an authorization rule to the current named policy.
If the rule already exists, the function returns false and the rule will not be added.
Otherwise the function returns true by adding the new rule.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
added := e.AddNamedPolicy("p", "eve", "data3", "read")
```

<!--Node.js-->
```typescript
const p = ['eve', 'data3', 'read']
const added = await e.addNamedPolicy('p', ...p)
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemovePolicy()`

RemovePolicy removes an authorization rule from the current policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.RemovePolicy("alice", "data1", "read")
```

<!--Node.js-->
```typescript
const p = ['alice', 'data1', 'read']
const removed = await e.removePolicy(...p)
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemoveFilteredPolicy()`

RemoveFilteredPolicy removes an authorization rule from the current policy, field filters can be specified.
RemovePolicy removes an authorization rule from the current policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.RemoveFilteredPolicy(0, "alice", "data1", "read")
```

<!--Node.js-->
```typescript
const p = ['alice', 'data1', 'read']
const removed = await e.removeFilteredPolicy(0, ...p)
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemoveNamedPolicy()`

RemoveNamedPolicy removes an authorization rule from the current named policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.RemoveNamedPolicy("p", "alice", "data1", "read")
```

<!--Node.js-->
```typescript
const p = ['alice', 'data1', 'read']
const removed = await e.removeNamedPolicy('p', ...p)
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemoveFilteredNamedPolicy()`

RemoveFilteredNamedPolicy removes an authorization rule from the current named policy, field filters can be specified.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.RemoveFilteredNamedPolicy("p", 0, "alice", "data1", "read")
```

<!--Node.js-->
```typescript
const p = ['alice', 'data1', 'read']
const removed = await e.removeFilteredNamedPolicy('p', 0, ...p)
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `HasGroupingPolicy()`

HasGroupingPolicy determines whether a role inheritance rule exists.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
has := e.HasGroupingPolicy("alice", "data2_admin")
```

<!--Node.js-->
```typescript
const has = e.hasGroupingPolicy('alice', 'data2_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `HasNamedGroupingPolicy()`

HasNamedGroupingPolicy determines whether a named role inheritance rule exists.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
has := e.HasNamedGroupingPolicy("g", "alice", "data2_admin")
```

<!--Node.js-->
```typescript
const has = e.hasNamedGroupingPolicy('g', 'alice', 'data2_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `AddGroupingPolicy()`

AddGroupingPolicy adds a role inheritance rule to the current policy.
If the rule already exists, the function returns false and the rule will not be added.
Otherwise the function returns true by adding the new rule.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
added := e.AddGroupingPolicy("group1", "data2_admin")
```

<!--Node.js-->
```typescript
const added = await e.addGroupingPolicy('group1', 'data2_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `AddNamedGroupingPolicy()`

AddNamedGroupingPolicy adds a named role inheritance rule to the current policy.
If the rule already exists, the function returns false and the rule will not be added.
Otherwise the function returns true by adding the new rule.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
added := e.AddNamedGroupingPolicy("g", "group1", "data2_admin")
```

<!--Node.js-->
```typescript
const added = await e.addNamedGroupingPolicy('g', 'group1', 'data2_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemoveGroupingPolicy()`

RemoveGroupingPolicy removes a role inheritance rule from the current policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.AddNamedGroupingPolicy("alice", "data2_admin")
```

<!--Node.js-->
```typescript
const removed = await e.removeGroupingPolicy('alice', 'data2_admin')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemoveFilteredGroupingPolicy()`

RemoveFilteredGroupingPolicy removes a role inheritance rule from the current policy, field filters can be specified.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.RemoveFilteredGroupingPolicy(0, "alice")
```

<!--Node.js-->
```typescript
const removed = await e.removeFilteredGroupingPolicy(0, 'alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemoveNamedGroupingPolicy()`

RemoveNamedGroupingPolicy removes a role inheritance rule from the current named policy.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.RemoveNamedGroupingPolicy("g", "alice")
```

<!--Node.js-->
```typescript
const removed = await e.removeNamedGroupingPolicy('g', 'alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `RemoveFilteredNamedGroupingPolicy()`

RemoveFilteredNamedGroupingPolicy removes a role inheritance rule from the current named policy, field filters can be specified.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
removed := e.RemoveFilteredNamedGroupingPolicy("g", 0, "alice")
```

<!--Node.js-->
```typescript
const removed = await e.removeFilteredNamedGroupingPolicy('g', 0, 'alice')
```

<!--END_DOCUSAURUS_CODE_TABS-->

### `AddFunction()`

AddFunction adds a customized function.

For example:

<!--DOCUSAURUS_CODE_TABS-->

<!--GO-->
```go
func CustomFunction(key1 string, key2 string) bool {
	if key1 == "/alice_data2/myid/using/res_id" && key2 == "/alice_data/:resource" {
		return true
	} else if key1 == "/alice_data2/myid/using/res_id" && key2 == "/alice_data2/:id/using/:resId" {
		return true
	} else {
		return false
	}
}

func CustomFunctionWrapper(args ...interface{}) (interface{}, error) {
	key1 := args[0].(string)
	key2 := args[1].(string)

	return bool(CustomFunction(key1, key2)), nil
}

e.AddFunction("keyMatchCustom", CustomFunctionWrapper)
```

<!--Node.js-->
```text
Method is not implemented
```

<!--END_DOCUSAURUS_CODE_TABS-->
