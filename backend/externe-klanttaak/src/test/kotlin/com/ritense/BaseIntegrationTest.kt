/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense

import com.ritense.authorization.specification.impl.NoopAuthorizationSpecificationFactory
import com.ritense.catalogiapi.service.ZaaktypeUrlProvider
import com.ritense.resource.service.ResourceService
import com.ritense.valtimo.operaton.domain.OperatonTask
import com.ritense.valtimo.contract.authentication.UserManagementService
import com.ritense.valtimo.contract.mail.MailSender
import com.ritense.zakenapi.ResourceProvider
import com.ritense.zakenapi.ZaakUrlProvider
import org.junit.jupiter.api.Tag
import org.springframework.boot.test.context.SpringBootTest


@SpringBootTest
@Tag("integration")
abstract class BaseIntegrationTest {
    lateinit var resourceService: ResourceService

    lateinit var userManagementService: UserManagementService

    lateinit var mailSender: MailSender

    lateinit var resourceProvider: ResourceProvider

    lateinit var zaakUrlProvider: ZaakUrlProvider

    lateinit var zaaktypeUrlProvider: ZaaktypeUrlProvider

    lateinit var noopAuthorizationSpecificationFactory: NoopAuthorizationSpecificationFactory<OperatonTask>
}
