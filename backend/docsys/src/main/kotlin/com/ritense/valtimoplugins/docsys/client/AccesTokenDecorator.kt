package com.ritense.valtimoplugins.docsys.client

import com.nimbusds.oauth2.sdk.token.AccessToken
import java.time.LocalDateTime

class AccesTokenDecorator(val accesToken: AccessToken, var tokenCreatedDate: LocalDateTime = LocalDateTime.now()) {

    fun isExpired(): Boolean {
        return LocalDateTime.now().isAfter(tokenCreatedDate.plusSeconds(accesToken.lifetime))
    }
}
