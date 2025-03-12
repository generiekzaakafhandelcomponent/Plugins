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
import {MTlsSslContextConfigurationComponent} from './components/mtls-sslcontextl-configuration/mtls-sslcontext-configuration.component';
import {MTLS_PLUGIN_LOGO_BASE64} from './assets';
const mTlsSslcontextPluginSpecification: PluginSpecification = {
    pluginId: 'mTLS-SSLContext',
    pluginConfigurationComponent: MTlsSslContextConfigurationComponent,
    pluginLogoBase64: MTLS_PLUGIN_LOGO_BASE64,
    functionConfigurationComponents: {},
    pluginTranslations: {
        nl: {
            title: 'mTLS-SSLContext',
            configurationTitle: 'Configuratienaam',
            description: 'Met deze plugin kan een mTLS SSLContext geconfigureerd worden.',
            base64ServerCert: 'Server certificaat als Base64 encoded string',
            base64PrivateKey: 'Client private key als Base64 encoded string',
            base64ClientCert: 'Client certificaat als Base64 encoded string'
        },
        en: {
            title: 'mTLS-SSLContext',
            configurationTitle: 'Configuration title',
            description: 'This plugin allows you to configure an mTLS SSLContext.',
            base64ServerCert: 'Server certificate as Base64 encoded string',
            base64PrivateKey: 'Client private key as Base64 encoded string',
            base64ClientCert: 'Client certificate as Base64 encoded string'
        },
        de: {
            title: 'mTLS-SSLContext',
            configurationTitle: 'Konfigurationstitel',
            description: 'Mit diesem Plugin können Sie einen mTLS SSLContext konfigurieren.',
            base64ServerCert: 'Serverzertifikat als Base64-kodierter String',
            base64PrivateKey: 'Privater Clientschlüssel als Base64-codierte Zeichenfolge',
            base64ClientCert: 'Client-Zertifikat als Base64-kodierter String'
        },
    },
};

export {mTlsSslcontextPluginSpecification};
