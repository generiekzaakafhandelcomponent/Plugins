package com.ritense.valtimoplugins.oiptask.domain

import com.fasterxml.jackson.annotation.JsonProperty
import java.net.URI
import java.time.OffsetDateTime
import java.time.Period
import java.util.UUID

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

data class Portaalformulier(
    val formulier: Formulier,
    val data: FormulierGegevens? = null,
    @JsonProperty("verzonden_data") val verzondenData: FormulierGegevens? = null,
)

data class Formulier(
    val soort: FormulierSoort = FormulierSoort.URL,
    val value: URI,
)

data class FormulierGegevens(
    @JsonProperty("volledige_naam") val volledigeNaam: String,
    @JsonProperty("upload_documenten") val uploadDocumenten: List<UploadedDocument>? = null,
)

data class UploadedDocument(
    val titel: String,
    val auteur: String,
    val formaat: String,
    val omschrijving: String,
    val informatieobjecttype: URI,
    val vertrouwelijkheidaanduiding: Vertrouwelijkheidaanduiding,
)

enum class Soort(val value: String) {
    @JsonProperty("externformulier")
    EXTERNFORMULIER("externformulier");
}

enum class Status {
    @JsonProperty("open") OPEN,
    @JsonProperty("uitgevoerd") UITGEVOERD,
    @JsonProperty("afgebroken") AFGEBROKEN,
    @JsonProperty("verwerkt") VERWERKT,
    @JsonProperty("ingetrokken") INGETROKKEN,
}

enum class Registratie {
    @JsonProperty("zaak") ZAAK,
    @JsonProperty("product") PRODUCT,
}

enum class Source {
    @JsonProperty("digid") DIGID,
}

enum class IdentifierType {
    @JsonProperty("bsn") BSN,
}

enum class LevelOfAssurance(val urn: String) {
    @JsonProperty("urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport")
    PASSWORD_PROTECTED_TRANSPORT("urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"),
    @JsonProperty("urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorContract")
    MOBILE_TWO_FACTOR_CONTRACT("urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorContract"),
    @JsonProperty("urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard")
    SMARTCARD("urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard"),
    @JsonProperty("urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI")
    SMARTCARD_PKI("urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI"),
}

enum class FormulierSoort {
    @JsonProperty("url") URL,
}

enum class Vertrouwelijkheidaanduiding {
    @JsonProperty("openbaar") OPENBAAR,
    @JsonProperty("intern") INTERN,
    @JsonProperty("vertrouwelijk") VERTROUWELIJK,
    @JsonProperty("zeer geheim") ZEER_GEHEIM,
}
