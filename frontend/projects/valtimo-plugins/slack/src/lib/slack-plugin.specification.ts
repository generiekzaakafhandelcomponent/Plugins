/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

import {PluginSpecification} from '@valtimo/plugin';
import {SlackConfigurationComponent} from './components/slack-configuration/slack-configuration.component';
import {SLACK_PLUGIN_LOGO_BASE64} from './assets';
import {PostMessageWithFileConfigurationComponent} from './components/post-message-with-file/post-message-with-file-configuration.component';
import {PostMessageConfigurationComponent} from './components/post-message/post-message-configuration.component';
import {ReceiveMessageConfigurationComponent} from './components/receive-message/receive-message-configuration.component';

const slackPluginSpecification: PluginSpecification = {
  pluginId: 'slack',
  pluginConfigurationComponent: SlackConfigurationComponent,
  pluginLogoBase64: SLACK_PLUGIN_LOGO_BASE64,
  functionConfigurationComponents: {
    'post-message': PostMessageConfigurationComponent,
    'post-message-with-file': PostMessageWithFileConfigurationComponent,
    'receive-message': ReceiveMessageConfigurationComponent,
  },
  pluginTranslations: {
    nl: {
      title: 'Slack',
      'post-message': 'Bericht plaatsen',
      'post-message-with-file': 'Bericht plaatsen met bestand',
      'receive-message': 'Bericht ontvangen',
      url: 'Slack URL',
      urlTooltip: 'Een URL naar de REST API van Slack.',
      description: 'Publiceer berichten met de Slack plugin, en start of vervolg een proces op een bericht uit Slack.',
      configurationTitle: 'Configuratienaam',
      configurationTitleTooltip:
        'De naam van de huidige plugin-configuratie. Onder deze naam kan de configuratie in de rest van de applicatie teruggevonden worden.',
      token: 'Token',
      tokenTooltip:
        'Authenticatie token met vereiste scopes. Om berichten te ontvangen is channels:history nodig, en moet de app lid zijn van het kanaal.',
      channel: 'Kanaal',
      channelTooltip:
        'Kanaal, privégroep of chatkanaal om een bericht naar te verzenden. Dit kan een gecodeerde ID of een naam zijn. Zie hieronder voor meer details.',
      channels: 'Kanalen',
      channelsTooltip:
        "Door komma's gescheiden lijst met kanaalnamen of ID's waar het bestand zal worden gedeeld.",
      message: 'Bericht',
      messageTooltip: 'De berichttekst.',
      filename: 'Bestandsnaam',
      filenameTooltip: 'De bestandsnaam van het bestand.',
      threadTs: 'Thread',
      threadTsTooltip:
        'Laat leeg om een nieuw bericht in het kanaal te plaatsen. Vul de tijdstempel van een eerder bericht in om als antwoord in die thread te reageren, bijvoorbeeld pv:slackThreadTs.',

      initialLookbackMinutes: 'Terugkijken bij eerste ronde (minuten)',
      initialLookbackMinutesTooltip:
        'Hoeveel minuten geschiedenis de eerste ronde van een kanaal meeneemt. Alles wat ouder is wordt nooit opgehaald, zodat een bestaand kanaal niet met terugwerkende kracht dossiers oplevert.',
      messagesPerPage: 'Berichten per pagina',
      messagesPerPageTooltip: 'Hoeveel berichten per aanvraag bij Slack worden opgehaald.',
      maxPagesPerPoll: "Maximum aantal pagina's per ronde",
      maxPagesPerPollTooltip:
        "Begrenst hoeveel pagina's per kanaal per ronde worden gelezen. Wordt deze grens geraakt, dan staat dat als waarschuwing in het logboek.",
      maxThreadsPerPoll: 'Maximum aantal threads per ronde',
      maxThreadsPerPollTooltip:
        'Slack kost één aanvraag per thread waarop een dossier wacht. Deze grens voorkomt dat veel wachtende dossiers het lezen van het kanaal zelf blokkeren.',

      receiveMessageDescription:
        'Start of vervolgt dit proces voor elk bericht in het opgegeven kanaal. Vul alleen een kanaal in om alle berichten te verwerken, of voeg een filter toe om alleen bepaalde berichten door dit proces te laten oppakken.',
      receiveChannel: 'Kanaal-ID',
      receiveChannelTooltip:
        'De ID van het kanaal dat gelezen wordt, bijvoorbeeld C012AB3CD. Een naam met # werkt hier niet: Slack leest geschiedenis alleen op ID.',
      messageContains: 'Bericht bevat',
      messageContainsTooltip: 'Filtert op een deel van de berichttekst.',
      userId: 'Gebruiker-ID',
      userIdTooltip: 'Filtert op de Slack-gebruiker die het bericht plaatste, bijvoorbeeld U012AB3CD.',
      threadScope: 'Berichten in threads',
      threadScopeTooltip:
        'Handig als één kanaal twee processtappen voedt: een startgebeurtenis die alleen op nieuwe gesprekken reageert, en een tussentijdse gebeurtenis die alleen de antwoorden daarop ziet.',
      'threadScope.ANY': 'Alle berichten',
      'threadScope.THREAD_STARTS_ONLY': 'Alleen berichten die een gesprek beginnen',
      'threadScope.THREAD_REPLIES_ONLY': 'Alleen antwoorden in een thread',
      includeBotMessages: 'Ook berichten van apps',
      includeBotMessagesTooltip:
        'Uit laten staan tenzij nodig. De berichten die deze plugin zelf plaatst komen ook langs, en een proces dat daarop antwoordt blijft anders zichzelf aan de praat houden.',
    },
    en: {
      title: 'Slack',
      'post-message': 'Post message',
      'post-message-with-file': 'Post message with file',
      'receive-message': 'Receive message',
      url: 'Slack URL',
      urlTooltip: 'A URL to the REST API of Slack',
      description: 'Post messages with the Slack plugin, and start or continue a process on a message from Slack.',
      configurationTitle: 'Configuration name',
      configurationTitleTooltip:
        'The name of the current plugin configuration. Under this name, the configuration can be found in the rest of the application.',
      token: 'Token',
      tokenTooltip:
        'Authentication token bearing required scopes. Receiving messages needs channels:history, and the app has to be a member of the channel.',
      channel: 'Channel',
      channelTooltip:
        'Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name. See below for more details.',
      channels: 'Channels',
      channelsTooltip:
        'Comma-separated list of channel names or IDs where the file will be shared.',
      message: 'Message',
      messageTooltip: 'The message text.',
      filename: 'Filename',
      filenameTooltip: 'The filename of the file.',
      threadTs: 'Thread',
      threadTsTooltip:
        'Leave empty to post a new message in the channel. Fill in the timestamp of an earlier message to answer inside that thread, for example pv:slackThreadTs.',

      initialLookbackMinutes: 'First poll looks back (minutes)',
      initialLookbackMinutesTooltip:
        'How many minutes of history the first poll of a channel considers. Anything older is never read, so adding an existing channel does not turn its past into cases.',
      messagesPerPage: 'Messages per page',
      messagesPerPageTooltip: 'How many messages are read per request to Slack.',
      maxPagesPerPoll: 'Maximum pages per poll',
      maxPagesPerPollTooltip:
        'Caps how many pages of one channel are read per poll. Reaching the cap is reported as a warning in the log.',
      maxThreadsPerPoll: 'Maximum threads per poll',
      maxThreadsPerPollTooltip:
        'Slack costs one request per thread a case is waiting in. This cap keeps a large number of waiting cases from crowding out the channel itself.',

      receiveMessageDescription:
        'Starts or continues this process for each message posted in the given channel. Fill in only a channel to handle every message, or add a filter to let this process pick up part of them.',
      receiveChannel: 'Channel id',
      receiveChannelTooltip:
        'The id of the channel to read, for example C012AB3CD. A #name does not work here: Slack only serves history by id.',
      messageContains: 'Message contains',
      messageContainsTooltip: 'Filters on part of the message text.',
      userId: 'User id',
      userIdTooltip: 'Filters on the Slack user who posted the message, for example U012AB3CD.',
      threadScope: 'Messages in threads',
      threadScopeTooltip:
        'Useful when one channel feeds two steps: a start event that should only fire on new conversations, and a catch event that should only see the answers to them.',
      'threadScope.ANY': 'All messages',
      'threadScope.THREAD_STARTS_ONLY': 'Only messages that start a conversation',
      'threadScope.THREAD_REPLIES_ONLY': 'Only replies inside a thread',
      includeBotMessages: 'Also messages from apps',
      includeBotMessagesTooltip:
        'Leave off unless needed. The messages this plugin posts itself come back too, and a process that answers them would keep itself running.',
    },
    de: {
      title: 'Slack',
      'post-message': 'Kommentar posten',
      'post-message-with-file': 'Kommentar mit Datei posten',
      'receive-message': 'Nachricht empfangen',
      url: 'Slack URL',
      urlTooltip: 'Die URL zur REST API von Slack',
      description:
        'Veröffentlichen Sie Nachrichten mit dem Slack-Plugin und starten oder setzen Sie einen Prozess anhand einer Slack-Nachricht fort.',
      configurationTitle: 'Konfigurationsname',
      configurationTitleTooltip:
        'Der Name der aktuellen Plugin-Konfiguration. Unter diesem Namen ist die Konfiguration im Rest der Anwendung zu finden.',
      token: 'Token',
      tokenTooltip:
        'Authentifizierungstoken mit erforderlichen scopes. Zum Empfangen wird channels:history benötigt, und die App muss Mitglied des Kanals sein.',
      channel: 'Channel',
      channelTooltip:
        'Kanal, private Gruppe oder IM-Kanal, an den die Nachricht gesendet werden soll. Kann eine codierte ID oder ein Name sein. Siehe unten für weitere Details.',
      channels: 'Kanäle',
      channelsTooltip:
        'Durch Komma getrennte Liste von Kanalnamen oder IDs, wo die Datei geteilt wird.',
      message: 'Kommentar',
      messageTooltip: 'Der Nachrichtentext.',
      filename: 'Dateiname',
      filenameTooltip: 'Der Dateiname der Datei.',
      threadTs: 'Thread',
      threadTsTooltip:
        'Leer lassen, um eine neue Nachricht im Kanal zu posten. Mit dem Zeitstempel einer früheren Nachricht wird innerhalb dieses Threads geantwortet, zum Beispiel pv:slackThreadTs.',

      initialLookbackMinutes: 'Rückblick beim ersten Lauf (Minuten)',
      initialLookbackMinutesTooltip:
        'Wie viele Minuten Verlauf der erste Lauf eines Kanals berücksichtigt. Alles Ältere wird nie gelesen, damit ein bestehender Kanal nicht rückwirkend Fälle erzeugt.',
      messagesPerPage: 'Nachrichten pro Seite',
      messagesPerPageTooltip: 'Wie viele Nachrichten pro Anfrage an Slack gelesen werden.',
      maxPagesPerPoll: 'Maximale Seiten pro Lauf',
      maxPagesPerPollTooltip:
        'Begrenzt, wie viele Seiten eines Kanals pro Lauf gelesen werden. Wird die Grenze erreicht, erscheint eine Warnung im Log.',
      maxThreadsPerPoll: 'Maximale Threads pro Lauf',
      maxThreadsPerPollTooltip:
        'Slack kostet eine Anfrage pro Thread, in dem ein Fall wartet. Diese Grenze verhindert, dass viele wartende Fälle das Lesen des Kanals selbst verdrängen.',

      receiveMessageDescription:
        'Startet oder setzt diesen Prozess für jede Nachricht im angegebenen Kanal fort. Nur einen Kanal angeben, um alle Nachrichten zu verarbeiten, oder einen Filter hinzufügen, damit dieser Prozess nur einen Teil davon aufgreift.',
      receiveChannel: 'Kanal-ID',
      receiveChannelTooltip:
        'Die ID des zu lesenden Kanals, zum Beispiel C012AB3CD. Ein #Name funktioniert hier nicht: Slack liefert den Verlauf nur per ID.',
      messageContains: 'Nachricht enthält',
      messageContainsTooltip: 'Filtert auf einen Teil des Nachrichtentexts.',
      userId: 'Benutzer-ID',
      userIdTooltip: 'Filtert auf den Slack-Benutzer, der die Nachricht gepostet hat, zum Beispiel U012AB3CD.',
      threadScope: 'Nachrichten in Threads',
      threadScopeTooltip:
        'Nützlich, wenn ein Kanal zwei Schritte versorgt: ein Startereignis nur für neue Gespräche und ein Zwischenereignis nur für die Antworten darauf.',
      'threadScope.ANY': 'Alle Nachrichten',
      'threadScope.THREAD_STARTS_ONLY': 'Nur Nachrichten, die ein Gespräch beginnen',
      'threadScope.THREAD_REPLIES_ONLY': 'Nur Antworten in einem Thread',
      includeBotMessages: 'Auch Nachrichten von Apps',
      includeBotMessagesTooltip:
        'Ausgeschaltet lassen, sofern nicht benötigt. Die von diesem Plugin selbst geposteten Nachrichten kommen ebenfalls zurück, und ein Prozess, der darauf antwortet, würde sich selbst am Laufen halten.',
    },
  },
};

export {slackPluginSpecification};
