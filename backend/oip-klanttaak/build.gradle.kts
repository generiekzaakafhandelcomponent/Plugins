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

val kotlinLoggingVersion: String by project
val mockitoKotlinVersion: String by project

dependencies {
    implementation("com.ritense.valtimo:contract")
    implementation("com.ritense.valtimo:case")
    implementation("com.ritense.valtimo:core")
    implementation("com.ritense.valtimo:notificaties-api")
    implementation("com.ritense.valtimo:objecten-api")
    implementation("com.ritense.valtimo:objecttypen-api")
    implementation("com.ritense.valtimo:object-management")
    implementation("com.ritense.valtimo:notificaties-api")
    implementation("com.ritense.valtimo:plugin-valtimo")
    implementation("com.ritense.valtimo:process-document")
    implementation("com.ritense.valtimo:value-resolver")
    implementation("com.ritense.valtimo:zaken-api")

    // Logging
    implementation("io.github.oshai:kotlin-logging:$kotlinLoggingVersion")

    // Testing
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.mockito:mockito-core")
    testImplementation("org.mockito.kotlin:mockito-kotlin:$mockitoKotlinVersion")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

apply(from = "gradle/publishing.gradle")
