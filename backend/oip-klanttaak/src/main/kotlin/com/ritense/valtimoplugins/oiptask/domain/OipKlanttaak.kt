package com.ritense.valtimoplugins.oiptask.domain

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonValue
import java.net.URI
import java.time.OffsetDateTime
import java.time.Period
import java.util.UUID

@JsonInclude(JsonInclude.Include.NON_NULL)
data class OipKlanttaak(
    val soort: Soort = Soort.EXTERNFORMULIER,
    val titel: String,
    val status: Status,
    val eigenaar: String,
    val koppeling: Koppeling? = null,
    val betrokkene: Betrokkene,
    val toelichting: String? = null,
    val doorlooptijd: Period? = null,
    val verloopdatum: OffsetDateTime? = null,
    val portaalformulier: Portaalformulier,
    @JsonProperty("verwerker_taak_id") val verwerkerTaakId: UUID,
    @JsonProperty("deadline_verlengbaar") val deadlineVerlengbaar: Boolean? = null,
)

data class Koppeling(
    val registratie: Registratie,
    val value: UUID,
)

data class Betrokkene(
    val source: Source = Source.DIGID,
    val levelOfAssurance: LevelOfAssurance,
    val authorizee: Authorizee,
)

data class Authorizee(
    val legalSubject: LegalSubject,
)

data class LegalSubject(
    val identifier: String,
    val identifierType: IdentifierType = IdentifierType.BSN,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Portaalformulier(
    val formulier: Formulier,
    val data: Map<String, Any>? = null,
    @JsonProperty("verzonden_data") val verzondenData: Map<String, Any>? = null,
)

data class Formulier(
    val soort: FormulierSoort = FormulierSoort.URL,
    val value: URI,
)

data class Document(
    val titel: String,
    val auteur: String,
    val formaat: String,
    val omschrijving: String,
    val informatieobjecttype: URI,
    val vertrouwelijkheidaanduiding: Vertrouwelijkheidaanduiding,
)

enum class Soort(@JsonValue val value: String) {
    EXTERNFORMULIER("externformulier");
}

enum class Status(@JsonValue val value: String) {
    OPEN("open"),
    UITGEVOERD("uitgevoerd"),
    AFGEBROKEN("afgebroken"),
    VERWERKT("verwerkt"),
    INGETROKKEN("ingetrokken"),
}

enum class Registratie(@JsonValue val value: String) {
    ZAAK("zaak"),
    PRODUCT("product"),
}

enum class Source(@JsonValue val value: String) {
    DIGID("digid"),
}

enum class IdentifierType(@JsonValue val value: String) {
    BSN("bsn"),
}

enum class LevelOfAssurance(@JsonValue val value: String) {
    PASSWORD_PROTECTED_TRANSPORT("urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"),
    MOBILE_TWO_FACTOR_CONTRACT("urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorContract"),
    SMARTCARD("urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard"),
    SMARTCARD_PKI("urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI"),
}

enum class FormulierSoort(@JsonValue val value: String) {
    URL("url"),
}

enum class Vertrouwelijkheidaanduiding(@JsonValue val value: String) {
    OPENBAAR("openbaar"),
    INTERN("intern"),
    VERTROUWELIJK("vertrouwelijk"),
    ZEER_GEHEIM("zeer geheim"),
}
