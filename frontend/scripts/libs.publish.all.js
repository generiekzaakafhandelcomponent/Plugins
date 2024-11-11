/*
 * Copyright 2015-2020 Ritense BV, the Netherlands.
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

/* Example usage:
 * npm run libs-publish-all -- ritense-nexus <npmtoken>
 * npm run libs-publish-all -- npmjs <npmtoken>
 * npm run libs-publish-all -- s3 <aws_access_key_id> <aws_secret_acces_key> 4.15.2
 */

const fs = require('fs');
const exec = require('child_process');
const path = require('path');

const destinationArg = process.argv.slice(2)[0];
if (!destinationArg) throw 'Invalid publish destination';

const accessKeyIdOrNpmToken = process.argv.slice(2)[1];
const secretAccessKey = process.argv.slice(2)[2];
const packageVersion = process.argv.slice(2)[3];

let destinationRegistry = 'localhost'
let accessModifier = ''
switch (destinationArg) {
    case 'npmjs':
        destinationRegistry = 'registry.npmjs.org/';
        if (!accessKeyIdOrNpmToken) throw 'Invalid npm token';
        accessModifier = ' --access public';
        break;
    default:
        console.log('Invalid publishing option');
}

const distDir = './dist/valtimo';
fs.readdirSync(distDir).forEach((dir) => {
    let cwd = process.cwd();
    process.chdir(path.resolve(`${distDir}/${dir}`));
    if(destinationArg === 'npmjs') {
        fs.writeFileSync('.npmrc', `@valtimo-plugins:registry=https://${destinationRegistry}\n` +
            `//${destinationRegistry}:_authToken=${accessKeyIdOrNpmToken}\n`);

        exec.execSync('npm publish'+accessModifier);
    }

    process.chdir(cwd);
});

console.log("Published all libraries");