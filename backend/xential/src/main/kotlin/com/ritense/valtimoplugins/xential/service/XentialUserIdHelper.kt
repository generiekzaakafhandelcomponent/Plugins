package com.ritense.valtimoplugins.xential.service

import com.ritense.valtimo.contract.authentication.UserManagementService
import io.github.oshai.kotlinlogging.KotlinLogging

class XentialUserIdHelper(
    private val userManagementService: UserManagementService,
) {
    fun getGebruikersId(): String {
        val user = userManagementService.currentUser
        return user.username
    }

    fun testGebruikersId(gebruikersId: String): String {
        logger.info { "gebruikersId: $gebruikersId" }
        return "bla"
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
