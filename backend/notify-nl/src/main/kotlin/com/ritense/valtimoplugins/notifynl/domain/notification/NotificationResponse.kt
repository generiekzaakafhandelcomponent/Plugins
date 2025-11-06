/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.notifynl.domain.notification

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable

data class SmsResponse(
    val content: SmsContent,
    val id: String,
    val reference: String?,
    @JsonProperty("scheduled_for")
    val scheduledFor: String?,
    val template: SmsTemplate,
    val uri: String
) : Serializable

data class SmsContent(
    val body: String,
    @JsonProperty("from_number")
    val fromNumber: String
) : Serializable

data class SmsTemplate(
    val id: String,
    val uri: String,
    val version: Int
) : Serializable

data class MessageResponse(
    val id: String,
    val reference: String?,
    @JsonProperty("email_address")
    val emailAddress: String?,
    @JsonProperty("phone_number")
    val phoneNumber: String?,
    @JsonProperty("line_1")
    val line1: String?,
    @JsonProperty("line_2")
    val line2: String?,
    @JsonProperty("line_3")
    val line3: String?,
    @JsonProperty("line_4")
    val line4: String?,
    @JsonProperty("line_5")
    val line5: String?,
    @JsonProperty("line_6")
    val line6: String?,
    @JsonProperty("line_7")
    val line7: String?,
    val postage: String?,
    val type: String,
    val status: String,
    val template: NotificationTemplate,
    val body: String,
    val subject: String?,
    @JsonProperty("created_at")
    val createdAt: String,
    @JsonProperty("created_by_name")
    val createdByName: String?,
    @JsonProperty("sent_at")
    val sentAt: String?,
    @JsonProperty("completed_at")
    val completedAt: String?,
    @JsonProperty("scheduled_for")
    val scheduledFor: String?,
    @JsonProperty("one_click_unsubscribe")
    val oneClickUnsubscribe: String?,
    @JsonProperty("is_cost_data_ready")
    val isCostDataReady: Boolean,
    @JsonProperty("cost_in_pounds")
    val costInPounds: Double?,
    @JsonProperty("cost_details")
    val costDetails: CostDetails?
) : Serializable

data class NotificationTemplate(
    val id: String,
    val uri: String,
    val version: Int
) : Serializable

data class CostDetails(
    @JsonProperty("billable_sms_fragments")
    val billableSmsFragments: Int?,
    @JsonProperty("international_rate_multiplier")
    val internationalRateMultiplier: Int?,
    @JsonProperty("sms_rate")
    val smsRate: Double?,
    @JsonProperty("billable_sheets_of_paper")
    val billableSheetsOfPaper: Int?,
    val postage: String?
) : Serializable

data class SmsResponseFlat(
    val id: String,
    val reference: String?,
    val scheduledFor: String?,
    val uri: String,
    val contentBody: String?,
    val contentFromNumber: String?,
    val templateId: String?,
    val templateUri: String?,
    val templateVersion: Int?
) : Serializable {
    companion object {
        fun from(original: SmsResponse): SmsResponseFlat {
            return SmsResponseFlat(
                id = original.id,
                reference = original.reference,
                scheduledFor = original.scheduledFor,
                uri = original.uri,
                contentBody = original.content.body,
                contentFromNumber = original.content.fromNumber,
                templateId = original.template.id,
                templateUri = original.template.uri,
                templateVersion = original.template.version
            )
        }
    }
}

data class MessageResponseFlat(
    val id: String,
    val reference: String?,
    val emailAddress: String?,
    val phoneNumber: String?,
    val line1: String?,
    val line2: String?,
    val line3: String?,
    val line4: String?,
    val line5: String?,
    val line6: String?,
    val line7: String?,
    val postage: String?,
    val type: String?,
    val status: String?,
    val body: String?,
    val subject: String?,
    val createdAt: String?,
    val createdByName: String?,
    val sentAt: String?,
    val completedAt: String?,
    val scheduledFor: String?,
    val oneClickUnsubscribe: String?,
    val isCostDataReady: Boolean?,
    val costInPounds: Double?,
    val templateId: String?,
    val templateUri: String?,
    val templateVersion: Int?,
    val costDetailsBillableSmsFragments: Int?,
    val costDetailsInternationalRateMultiplier: Int?,
    val costDetailsSmsRate: Double?,
    val costDetailsBillableSheetsOfPaper: Int?,
    val costDetailsPostage: String?
) : Serializable {
    companion object {
        fun from(original: MessageResponse): MessageResponseFlat {
            return MessageResponseFlat(
                id = original.id,
                reference = original.reference,
                emailAddress = original.emailAddress,
                phoneNumber = original.phoneNumber,
                line1 = original.line1,
                line2 = original.line2,
                line3 = original.line3,
                line4 = original.line4,
                line5 = original.line5,
                line6 = original.line6,
                line7 = original.line7,
                postage = original.postage,
                type = original.type,
                status = original.status,
                body = original.body,
                subject = original.subject,
                createdAt = original.createdAt,
                createdByName = original.createdByName,
                sentAt = original.sentAt,
                completedAt = original.completedAt,
                scheduledFor = original.scheduledFor,
                oneClickUnsubscribe = original.oneClickUnsubscribe,
                isCostDataReady = original.isCostDataReady,
                costInPounds = original.costInPounds,
                templateId = original.template.id,
                templateUri = original.template.uri,
                templateVersion = original.template.version,
                costDetailsBillableSmsFragments = original.costDetails?.billableSmsFragments,
                costDetailsInternationalRateMultiplier = original.costDetails?.internationalRateMultiplier,
                costDetailsSmsRate = original.costDetails?.smsRate,
                costDetailsBillableSheetsOfPaper = original.costDetails?.billableSheetsOfPaper,
                costDetailsPostage = original.costDetails?.postage
            )
        }
    }
}