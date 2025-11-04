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

data class SendSmsResponse(
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

data class GetMessageResponse(
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