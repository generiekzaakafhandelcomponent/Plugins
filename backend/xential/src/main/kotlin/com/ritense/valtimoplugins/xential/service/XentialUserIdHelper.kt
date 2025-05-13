package com.ritense.valtimoplugins.xential.service

import com.ritense.valtimo.contract.authentication.UserManagementService

class XentialUserIdHelper(
    private val userManagementService: UserManagementService
) {

    fun getXentialUserId(): String {
        val user = userManagementService.currentUser
        return user.username
    }

}
