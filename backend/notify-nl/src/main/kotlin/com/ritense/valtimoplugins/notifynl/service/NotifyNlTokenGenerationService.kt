package com.ritense.valtimoplugins.notifynl.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import mu.KotlinLogging
import java.nio.charset.Charset
import java.util.Date
import java.util.UUID

private val logger = KotlinLogging.logger {}

class NotifyNlTokenGenerationService {
    fun generateToken(serviceId: UUID, secretKey: UUID): String {
        logger.debug { "Generating a token for a request to NotifyNL" }

        val signingKey = Keys.hmacShaKeyFor(secretKey.toString().toByteArray(Charset.forName("UTF-8")))

        val jwtBuilder = Jwts.builder()
        jwtBuilder
            .issuer(serviceId.toString())
            .issuedAt(Date())

        return jwtBuilder
            .signWith(signingKey)
            .compact()
    }
}