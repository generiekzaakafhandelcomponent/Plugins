package com.ritense.valtimoplugins.xential.service

import com.ritense.valtimo.contract.authentication.UserManagementService

@Suppress("UNUSED")
class XentialUserIdHelper(
    private val userManagementService: UserManagementService,
) {
    fun getCurrentUserEmail(): String {
        val user = userManagementService.currentUser
        return user.email
    }

    fun getAssigneeUsername(assigneeId: String): String {
        return userManagementService.findById(assigneeId).username
    }
}
