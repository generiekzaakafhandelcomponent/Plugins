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

package com.ritense.valtimoplugins.xential.web.rest

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimo.contract.domain.ValtimoMediaType
import com.ritense.valtimoplugins.xential.service.XentialSjablonenService
import com.rotterdam.esb.xential.model.Sjabloonitems
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@SkipComponentScan
@RequestMapping("/api", produces = [ValtimoMediaType.APPLICATION_JSON_UTF8_VALUE])
class XentialSjablonenResource(
    val xentialSjablonenService: XentialSjablonenService,
) {
    @GetMapping("/v1/xential/sjablonen")
    fun getSjablonenFromDefaultGroup(
        @RequestParam gebruikersId: String,
        @RequestParam sjabloonGroupId: String?,
    ): Sjabloonitems {
        logger.info { "gebruikersId: $gebruikersId, sjabloonGroupId: $sjabloonGroupId" }
        val items = xentialSjablonenService.getTemplateList(gebruikersId, sjabloonGroupId)
        logger.info { "$sjabloonGroupId found sjablonen: ${items.sjablonen.size } sjabloongroepen: ${items.sjabloongroepen.size }" }
        return items
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
