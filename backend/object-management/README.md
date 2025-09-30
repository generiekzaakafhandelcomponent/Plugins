The Valtimo plugin that supports CRUD actions in the ZGW Objects registration.

# Release notes 

## 1.0.0
- The scope of process variables that are passed as part of the `objectData` property to the `create-object` and `update-object` plugin actions has changed.  
  In versions prior to this one, passed process variables (`pv:*`) would fetch all process variable values with the given name in any of the processes that belonged to a case.
  This could cause issues if you have process variables with the same name in multiple process instances. (For example when you have a call-activity in your process that is called multiple times.)  
  From version 1.0.0, process variables will only be looked up in the scope of the process instance that the plugin action is attached to.
