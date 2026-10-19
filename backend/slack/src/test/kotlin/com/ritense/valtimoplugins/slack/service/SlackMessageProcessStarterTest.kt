/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.slack.service

import com.ritense.document.domain.Document
import com.ritense.document.domain.impl.JsonSchemaDocumentDefinitionId
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.document.service.DocumentService
import com.ritense.document.service.result.CreateDocumentResult
import com.ritense.plugin.domain.PluginProcessLink
import com.ritense.processdocument.domain.ProcessDefinitionKey
import com.ritense.processdocument.domain.ProcessDocumentDefinition
import com.ritense.processdocument.domain.ProcessDocumentDefinitionId
import com.ritense.processdocument.domain.ProcessDocumentInstance
import com.ritense.processdocument.service.ProcessDocumentAssociationService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimo.service.ProcessPropertyService
import com.ritense.valtimoplugins.slack.BaseTest
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.entry
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.RepositoryService
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.repository.ProcessDefinition
import org.camunda.bpm.engine.repository.ProcessDefinitionQuery
import org.camunda.bpm.engine.runtime.Execution
import org.camunda.bpm.engine.runtime.ExecutionQuery
import org.camunda.bpm.engine.runtime.MessageCorrelationBuilder
import org.camunda.bpm.engine.runtime.ProcessInstance
import org.camunda.bpm.model.bpmn.BpmnModelInstance
import org.camunda.bpm.model.bpmn.instance.CatchEvent
import org.camunda.bpm.model.bpmn.instance.Message
import org.camunda.bpm.model.bpmn.instance.MessageEventDefinition
import java.util.Optional
import java.util.UUID

/**
 * Covers both sides of the starter: where a case is started when the link hangs on a message
 * start event, and which of the instances parked at a receive task a given Slack message may
 * resume.
 *
 * The broadcast the resume side guards against is not a hypothetical. The execution query is
 * scoped to a process definition and an activity, not to a case, so without correlation every
 * case waiting for its own answer would be handed the first message that arrived for any of
 * them.
 */
class SlackMessageProcessStarterTest : BaseTest() {
    private lateinit var runtimeService: RuntimeService
    private lateinit var executionQuery: ExecutionQuery
    private lateinit var repositoryService: RepositoryService
    private lateinit var processPropertyService: ProcessPropertyService
    private lateinit var documentService: DocumentService
    private lateinit var processDocumentAssociationService: ProcessDocumentAssociationService
    private lateinit var starter: SlackMessageProcessStarter

    @BeforeEach
    fun setUp() {
        runtimeService = mock()
        executionQuery = mock()
        repositoryService = mock()
        processPropertyService = mock()
        documentService = mock()
        processDocumentAssociationService = mock()

        whenever(runtimeService.createExecutionQuery()).thenReturn(executionQuery)
        whenever(executionQuery.processDefinitionId(any())).thenReturn(executionQuery)
        whenever(executionQuery.activityId(any())).thenReturn(executionQuery)

        starter =
            SlackMessageProcessStarter(
                runtimeService,
                repositoryService,
                processPropertyService,
                documentService,
                processDocumentAssociationService,
            )
    }

    /**
     * The regression this guards against: starting the process by its definition key instead.
     *
     * A process may have more than one start event - a plain one for the start form and this
     * message start event for the channel - and Camunda enters a process started by key at
     * whichever it considers the initial activity, which is the plain one. The message's own
     * start event then never runs, so neither do the execution listeners that put the message on
     * the case, and the case is created empty.
     */
    @Test
    fun `should start a case by correlating the start message of the linked element`() {
        val link = messageStartEvent()
        val documentId = JsonSchemaDocumentId.existingId(UUID.fromString("11111111-2222-3333-4444-555555555555"))
        givenACaseCanBeStartedFor(link, documentId)
        val correlation = givenStartMessageCorrelates("IncomingSlackMessage", PROCESS_INSTANCE_ID)

        val started = starter.start(link, reply(threadTs = null))

        assertThat(started).isTrue()
        verify(correlation).processDefinitionId("Verwerk_slackbericht_handmatig:1:abc")
        // Valtimo resolves `doc:` through the business key until the association below exists,
        // so the start event's own listeners depend on it being the document id.
        verify(correlation).processInstanceBusinessKey(documentId.toString())
        verify(correlation).correlateStartMessage()
        verify(processDocumentAssociationService).createProcessDocumentInstance(
            eq(PROCESS_INSTANCE_ID),
            eq(UUID.fromString("11111111-2222-3333-4444-555555555555")),
            eq("Verwerk slackbericht handmatig"),
        )
    }

    @Test
    fun `should hand the message on as process variables when it starts a case`() {
        val link = messageStartEvent()
        givenACaseCanBeStartedFor(
            link,
            JsonSchemaDocumentId.existingId(UUID.fromString("11111111-2222-3333-4444-555555555555")),
        )
        val correlation = givenStartMessageCorrelates("IncomingSlackMessage", PROCESS_INSTANCE_ID)
        val message = reply(threadTs = null)

        starter.start(link, message)

        verify(correlation).setVariables(message.toProcessVariables())
    }

    @Test
    fun `should not start a case for a process definition version that is no longer the latest`() {
        // Valtimo copies process links onto every new version of a process. Without this guard
        // a single message would start one case per version that was ever deployed.
        val link = messageStartEvent()
        givenACaseCanBeStartedFor(
            link,
            JsonSchemaDocumentId.existingId(UUID.fromString("11111111-2222-3333-4444-555555555555")),
            latestProcessDefinitionId = "Verwerk_slackbericht_handmatig:2:def",
        )

        val started = starter.start(link, reply(threadTs = null))

        assertThat(started).isFalse()
        verify(documentService, never()).createDocument(any())
        verify(runtimeService, never()).createMessageCorrelation(any())
    }

    @Test
    fun `should start a case on any tenant's latest version of the process definition`() {
        // With tenants there is a latest version per tenant, so the query returns more than one.
        val link = messageStartEvent()
        givenACaseCanBeStartedFor(
            link,
            JsonSchemaDocumentId.existingId(UUID.fromString("11111111-2222-3333-4444-555555555555")),
            latestProcessDefinitionIds = listOf("Verwerk_slackbericht_handmatig:3:ghi", link.processDefinitionId),
        )
        givenStartMessageCorrelates("IncomingSlackMessage", PROCESS_INSTANCE_ID)

        assertThat(starter.start(link, reply(threadTs = null))).isTrue()
    }

    @Test
    fun `should leave an association Valtimo already made at the start event alone`() {
        // Valtimo's start event listener associates the instance itself, possibly with another
        // document. Creating one regardless throws on that.
        val link = messageStartEvent()
        givenACaseCanBeStartedFor(
            link,
            JsonSchemaDocumentId.existingId(UUID.fromString("11111111-2222-3333-4444-555555555555")),
        )
        givenStartMessageCorrelates("IncomingSlackMessage", PROCESS_INSTANCE_ID)
        doReturn(Optional.of(mock<ProcessDocumentInstance>()))
            .whenever(processDocumentAssociationService)
            .findProcessDocumentInstance(any())

        assertThat(starter.start(link, reply(threadTs = null))).isTrue()
        verify(processDocumentAssociationService, never()).createProcessDocumentInstance(any(), any(), any())
    }

    @Test
    fun `should skip a case process that may not initialise a document instead of failing`() {
        // Failing would roll back the claim and hold the channel cursor at this message, so
        // every later poll would fail on it again - for a setting that does not change.
        val link = messageStartEvent()
        givenACaseCanBeStartedFor(
            link,
            JsonSchemaDocumentId.existingId(UUID.fromString("11111111-2222-3333-4444-555555555555")),
            canInitializeDocument = false,
        )

        assertThat(starter.start(link, reply(threadTs = null))).isFalse()
        verify(documentService, never()).createDocument(any())
        verify(runtimeService, never()).createMessageCorrelation(any())
    }

    @Test
    fun `should skip a process that is linked to no document definition`() {
        val link = messageStartEvent()
        givenACaseCanBeStartedFor(
            link,
            JsonSchemaDocumentId.existingId(UUID.fromString("11111111-2222-3333-4444-555555555555")),
        )
        doReturn(Optional.empty<ProcessDocumentDefinition>())
            .whenever(processDocumentAssociationService)
            .findProcessDocumentDefinition(any<ProcessDefinitionKey>())

        assertThat(starter.start(link, reply(threadTs = null))).isFalse()
        verify(documentService, never()).createDocument(any())
        verify(runtimeService, never()).createMessageCorrelation(any())
    }

    @Test
    fun `should start the latest version of a system process`() {
        val link = systemProcessStartEvent("slack-intake:2:def")
        givenLatestVersionOf("slack-intake", "slack-intake:2:def")
        val correlation = givenStartMessageCorrelates("IncomingSlackMessage", PROCESS_INSTANCE_ID)

        assertThat(starter.start(link, reply(threadTs = null))).isTrue()
        verify(correlation).processDefinitionId("slack-intake:2:def")
        verify(correlation).correlateStartMessage()
    }

    @Test
    fun `should not start an earlier version of a system process`() {
        // Valtimo copies the link onto every new version and the old one keeps its own, so
        // without this one message would start an instance of every version ever deployed.
        val link = systemProcessStartEvent("slack-intake:1:abc")
        givenLatestVersionOf("slack-intake", "slack-intake:2:def")

        assertThat(starter.start(link, reply(threadTs = null))).isFalse()
        verify(runtimeService, never()).createMessageCorrelation(any())
    }

    @Test
    fun `should resume only the case the reply belongs to`() {
        waiting("execution-a" to "instance-a", "execution-b" to "instance-b")
        awaits("instance-a", "1735689600.000100")
        awaits("instance-b", "1735689600.000200")

        val resumed = starter.start(receiveTask(), reply(threadTs = "1735689600.000200"))

        assertThat(resumed).isTrue()
        verify(runtimeService).signal(eq("execution-b"), any<Map<String, Any>>())
        verify(runtimeService, never()).signal(eq("execution-a"), any<Map<String, Any>>())
    }

    @Test
    fun `should resume nothing when the reply belongs to a thread nobody is waiting on`() {
        waiting("execution-a" to "instance-a")
        awaits("instance-a", "1735689600.000100")

        val resumed = starter.start(receiveTask(), reply(threadTs = "1735689600.000999"))

        assertThat(resumed).isFalse()
        verify(runtimeService, never()).signal(any(), any<Map<String, Any>>())
    }

    @Test
    fun `should resume nothing for a message that is part of no thread at all`() {
        // A fresh message in the channel is not an answer to anything. Signalling on it is
        // exactly the broadcast this correlation exists to prevent.
        waiting("execution-a" to "instance-a", "execution-b" to "instance-b")
        awaits("instance-a", "1735689600.000100")
        awaits("instance-b", "1735689600.000200")

        val resumed = starter.start(receiveTask(), reply(threadTs = null))

        assertThat(resumed).isFalse()
        verify(runtimeService, never()).signal(any(), any<Map<String, Any>>())
    }

    @Test
    fun `should treat the thread parent itself as belonging to its own thread`() {
        // Slack reports the parent of a thread with thread_ts equal to its own ts, and a case
        // started by that message remembers exactly that value.
        waiting("execution-a" to "instance-a")
        awaits("instance-a", "1735689600.000100")

        val parent =
            SlackMessage(
                channel = CHANNEL,
                ts = "1735689600.000100",
                threadTs = "1735689600.000100",
                text = "Original question",
                userId = "U012AB3CD",
            )

        assertThat(starter.start(receiveTask(), parent)).isTrue()
        verify(runtimeService).signal(eq("execution-a"), any<Map<String, Any>>())
    }

    @Test
    fun `should match timestamps that differ only in trailing precision`() {
        // Slack trims trailing zeroes on some payloads, so the value a case stored and the
        // value a later message reports can be the same instant spelled two ways.
        waiting("execution-a" to "instance-a")
        awaits("instance-a", "1735689600.0001")

        val resumed = starter.start(receiveTask(), reply(threadTs = "1735689600.000100"))

        assertThat(resumed).isTrue()
        verify(runtimeService).signal(eq("execution-a"), any<Map<String, Any>>())
    }

    @Test
    fun `should resume every case in the thread when one instance waits at the task twice`() {
        waiting("execution-a" to "instance-a", "execution-b" to "instance-a")
        awaits("instance-a", "1735689600.000100")

        val resumed = starter.start(receiveTask(), reply(threadTs = "1735689600.000100"))

        assertThat(resumed).isTrue()
        verify(runtimeService).signal(eq("execution-a"), any<Map<String, Any>>())
        verify(runtimeService).signal(eq("execution-b"), any<Map<String, Any>>())
    }

    @Test
    fun `should hand the message on as process variables when it does resume`() {
        waiting("execution-a" to "instance-a")
        awaits("instance-a", "1735689600.000100")

        val message = reply(threadTs = "1735689600.000100")
        starter.start(receiveTask(), message)

        verify(runtimeService).signal(eq("execution-a"), eq(message.toProcessVariables()))
    }

    @Test
    fun `should report nothing resumed when no execution is waiting`() {
        waiting()

        val resumed = starter.start(receiveTask(), reply(threadTs = "1735689600.000100"))

        assertThat(resumed).isFalse()
        verify(runtimeService, never()).signal(any(), any<Map<String, Any>>())
    }

    @Test
    fun `should report the threads waiting cases expect an answer in`() {
        // This is what keeps the poller from having to track every thread in the workspace:
        // it asks Slack about the open conversations only.
        waiting("execution-a" to "instance-a", "execution-b" to "instance-b")
        awaits("instance-a", "1735689600.000100")
        awaits("instance-b", "1735689600.000200")

        assertThat(starter.threadsAwaitingReply(receiveTask()))
            .containsOnlyKeys("1735689600.000100", "1735689600.000200")
    }

    @Test
    fun `should report each thread with the position of the case waiting in it`() {
        // The position comes from the case, not from how far the channel has been read: a
        // case that parks late would otherwise have its answer skipped, because the channel
        // has moved on past it in the meantime.
        waiting("execution-a" to "instance-a")
        awaits("instance-a", "1735689600.000100")
        hasSeen("instance-a", "1735689650.000150")

        assertThat(starter.threadsAwaitingReply(receiveTask()))
            .containsExactly(entry("1735689600.000100", "1735689650.000150"))
    }

    @Test
    fun `should report no position for a case that has not recorded one`() {
        // Read the thread from its start then, and let the claim table drop what was handled.
        waiting("execution-a" to "instance-a")
        awaits("instance-a", "1735689600.000100")

        assertThat(starter.threadsAwaitingReply(receiveTask()))
            .containsExactly(entry("1735689600.000100", null))
    }

    @Test
    fun `should report the earliest position when two cases wait in one thread`() {
        // The thread is read once. Reading it from the later position would cost the case
        // that is further behind its answer.
        waiting("execution-a" to "instance-a", "execution-b" to "instance-b")
        awaits("instance-a", "1735689600.000100")
        awaits("instance-b", "1735689600.000100")
        hasSeen("instance-a", "1735689900.000500")
        hasSeen("instance-b", "1735689650.000150")

        assertThat(starter.threadsAwaitingReply(receiveTask()))
            .containsExactly(entry("1735689600.000100", "1735689650.000150"))
    }

    @Test
    fun `should report no threads for a message start event`() {
        // A start event has nothing waiting at it by definition, and querying executions for
        // one would cost a call per poll to learn that.
        val startEvent =
            mock<PluginProcessLink>().also {
                whenever(it.activityType).thenReturn(ActivityTypeWithEventName.MESSAGE_START_EVENT_START)
            }

        assertThat(starter.threadsAwaitingReply(startEvent)).isEmpty()
        verify(runtimeService, never()).createExecutionQuery()
    }

    private fun waiting(vararg executions: Pair<String, String>) {
        // Built before the stubbing rather than inside it: stubbing one mock while another
        // stubbing call is still open is what Mockito calls unfinished stubbing.
        val parked =
            executions.map { (executionId, processInstanceId) ->
                mock<Execution>().also {
                    whenever(it.id).thenReturn(executionId)
                    whenever(it.processInstanceId).thenReturn(processInstanceId)
                }
            }
        whenever(executionQuery.list()).thenReturn(parked)
    }

    /** Records which thread the case behind [processInstanceId] expects an answer in. */
    private fun awaits(
        processInstanceId: String,
        threadTs: String,
    ) {
        whenever(runtimeService.getVariable(processInstanceId, SlackMessage.THREAD_TS_VARIABLE))
            .thenReturn(threadTs)
    }

    /** Records the last message the case behind [processInstanceId] has already seen. */
    private fun hasSeen(
        processInstanceId: String,
        messageTs: String,
    ) {
        whenever(runtimeService.getVariable(processInstanceId, SlackMessage.MESSAGE_TS_VARIABLE))
            .thenReturn(messageTs)
    }

    private fun messageStartEvent(): PluginProcessLink =
        mock<PluginProcessLink>().also {
            whenever(it.activityType).thenReturn(ActivityTypeWithEventName.MESSAGE_START_EVENT_START)
            whenever(it.activityId).thenReturn("Event_0beitek")
            whenever(it.processDefinitionId).thenReturn("Verwerk_slackbericht_handmatig:1:abc")
        }

    private fun systemProcessStartEvent(processDefinitionId: String): PluginProcessLink =
        mock<PluginProcessLink>().also {
            whenever(it.activityType).thenReturn(ActivityTypeWithEventName.MESSAGE_START_EVENT_START)
            whenever(it.activityId).thenReturn("Event_0beitek")
            whenever(it.processDefinitionId).thenReturn(processDefinitionId)
            whenever(processPropertyService.isSystemProcessById(processDefinitionId)).thenReturn(true)
        }

    private fun givenLatestVersionOf(
        key: String,
        latestProcessDefinitionId: String,
    ) {
        val linked = mock<ProcessDefinition>()
        whenever(linked.key).thenReturn(key)
        val latest = mock<ProcessDefinition>()
        whenever(latest.id).thenReturn(latestProcessDefinitionId)
        val query = mock<ProcessDefinitionQuery>()
        whenever(query.processDefinitionKey(key)).thenReturn(query)
        whenever(query.latestVersion()).thenReturn(query)
        whenever(query.list()).thenReturn(listOf(latest))
        whenever(repositoryService.getProcessDefinition(any())).thenReturn(linked)
        whenever(repositoryService.createProcessDefinitionQuery()).thenReturn(query)
    }

    /**
     * Everything between "this link points at a message start event" and "a case may be created
     * for it": the link is on the latest version of the process, the process is not a system
     * process, it is linked to a document definition that allows document initialisation, and
     * the document itself is created.
     */
    private fun givenACaseCanBeStartedFor(
        link: PluginProcessLink,
        documentId: JsonSchemaDocumentId,
        latestProcessDefinitionId: String = link.processDefinitionId,
        latestProcessDefinitionIds: List<String> = listOf(latestProcessDefinitionId),
        canInitializeDocument: Boolean = true,
    ) {
        val processDocumentDefinitionId = mock<ProcessDocumentDefinitionId>()
        whenever(processDocumentDefinitionId.documentDefinitionId())
            .thenReturn(JsonSchemaDocumentDefinitionId.existingId("slackverwerking", 1))
        val processDocumentDefinition = mock<ProcessDocumentDefinition>()
        whenever(processDocumentDefinition.processDocumentDefinitionId()).thenReturn(processDocumentDefinitionId)
        whenever(processDocumentDefinition.canInitializeDocument()).thenReturn(canInitializeDocument)

        // Each mock is finished before the next stubbing starts; stubbing one inside another
        // `thenReturn(...)` is what Mockito reports as unfinished stubbing.
        val document = mock<Document>()
        whenever(document.id()).thenReturn(documentId)
        val createResult = mock<CreateDocumentResult>()
        doReturn(Optional.of(document)).whenever(createResult).resultingDocument()
        val processDefinition = mock<ProcessDefinition>()
        whenever(processDefinition.key).thenReturn("Verwerk_slackbericht_handmatig")
        whenever(processDefinition.name).thenReturn("Verwerk slackbericht handmatig")
        val latestProcessDefinitions =
            latestProcessDefinitionIds.map { id ->
                mock<ProcessDefinition>().also { whenever(it.id).thenReturn(id) }
            }
        val processDefinitionQuery = mock<ProcessDefinitionQuery>()
        whenever(processDefinitionQuery.processDefinitionKey(any())).thenReturn(processDefinitionQuery)
        whenever(processDefinitionQuery.latestVersion()).thenReturn(processDefinitionQuery)
        whenever(processDefinitionQuery.list()).thenReturn(latestProcessDefinitions)

        whenever(processPropertyService.isSystemProcessById(link.processDefinitionId)).thenReturn(false)
        doReturn(Optional.of(processDocumentDefinition))
            .whenever(processDocumentAssociationService)
            .findProcessDocumentDefinition(any<ProcessDefinitionKey>())
        whenever(documentService.createDocument(any())).thenReturn(createResult)
        whenever(repositoryService.getProcessDefinition(link.processDefinitionId)).thenReturn(processDefinition)
        whenever(repositoryService.createProcessDefinitionQuery()).thenReturn(processDefinitionQuery)
    }

    /** Stubs the BPMN lookup of the message name and the correlation builder chain. */
    private fun givenStartMessageCorrelates(
        messageName: String,
        processInstanceId: String,
    ): MessageCorrelationBuilder {
        val message = mock<Message>()
        whenever(message.name).thenReturn(messageName)
        val messageEventDefinition = mock<MessageEventDefinition>()
        whenever(messageEventDefinition.message).thenReturn(message)
        val catchEvent = mock<CatchEvent>()
        whenever(catchEvent.eventDefinitions).thenReturn(listOf(messageEventDefinition))
        val model = mock<BpmnModelInstance>()
        doReturn(catchEvent).whenever(model).getModelElementById<CatchEvent>(any())
        whenever(repositoryService.getBpmnModelInstance(any())).thenReturn(model)

        val processInstance = mock<ProcessInstance>()
        whenever(processInstance.id).thenReturn(processInstanceId)
        val correlation = mock<MessageCorrelationBuilder>()
        whenever(runtimeService.createMessageCorrelation(messageName)).thenReturn(correlation)
        whenever(correlation.processDefinitionId(any())).thenReturn(correlation)
        whenever(correlation.processInstanceBusinessKey(any())).thenReturn(correlation)
        whenever(correlation.setVariables(any())).thenReturn(correlation)
        whenever(correlation.correlateStartMessage()).thenReturn(processInstance)
        return correlation
    }

    private fun receiveTask(): PluginProcessLink =
        mock<PluginProcessLink>().also {
            whenever(it.activityType).thenReturn(ActivityTypeWithEventName.RECEIVE_TASK_END)
            whenever(it.activityId).thenReturn("await-reply")
            whenever(it.processDefinitionId).thenReturn("slack-intake-process:1:abc")
        }

    private fun reply(threadTs: String?) =
        SlackMessage(
            channel = CHANNEL,
            ts = "1735689900.000500",
            threadTs = threadTs,
            text = "Yes, go ahead",
            userId = "U012AB3CD",
            userName = "jan",
        )

    private companion object {
        private const val CHANNEL = "C012AB3CD"
        private const val PROCESS_INSTANCE_ID = "99999999-8888-7777-6666-555555555555"
    }
}
