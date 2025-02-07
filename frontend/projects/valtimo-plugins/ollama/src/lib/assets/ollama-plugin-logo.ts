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

const OLLAMA_PLUGIN_LOGO_BASE64 =
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMTgxLjAwMDAwMHB0IiBoZWlnaHQ9IjI1Ni4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDE4MS4wMDAwMDAgMjU2LjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMjU2LjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIj4KPHBhdGggZD0iTTM3NyAyMzY1IGMtNTIgLTE4IC04MyAtNDkgLTExNyAtMTE2IC00NSAtODkgLTYyIC0xOTIgLTU4IC0zNTUgbDMKLTE0MiAtNTggLTYxIGMtMTQ4IC0xNTUgLTE4NSAtMzg3IC05MiAtNTc0IGwzNCAtNjkgLTIwIC00NCBjLTM0IC04MiAtNTAKLTE2NCAtNTAgLTI2MyAwIC0xMDggMTggLTE5MCA1OCAtMjYyIGwyNiAtNDggLTIxIC00OSBjLTEyIC0yNyAtMjYgLTcxIC0zMgotOTggLTE0IC02MiAtMTUgLTIyMSAtMSAtMjU3IDEwIC0yNiAxNCAtMjcgNzYgLTI3IDczIDAgNzAgLTQgNTMgODYgLTE1IDgyIDIKMTg4IDQyIDI2NiAzNyA3MCAzOCAxMDQgNSAxNDggLTQ3IDY0IC02OCAxMzYgLTY5IDI0MCAtMSAxMDMgMTQgMTYwIDY2IDI2MQozMSA2MSAyOSA4NyAtMTAgMTIyIC0xMSAxMCAtMzEgNDIgLTQzIDcwIC0xOSA0MiAtMjQgNjkgLTIzIDE0MiAwIDExNCAyNSAxODMKOTUgMjYwIDcwIDc2IDE0MiAxMTAgMjM5IDExMiA0MSAwIDc4IDIgODIgMiA0IDEgMTcgMjIgMjkgNDcgMzAgNTkgOTYgMTE5CjE2NyAxNTIgNDkgMjMgNzAgMjcgMTQ3IDI3IDc5IDAgOTcgLTQgMTQ5IC0yOSA2OCAtMzMgMTMzIC05NCAxNTkgLTE0OCAxMAotMjAgMjMgLTQxIDMwIC00NSA2IC00IDQ2IC04IDg3IC04IDY3IC0xIDgzIC01IDE0MCAtMzYgMTIzIC02OCAxOTMgLTE4NyAxOTMKLTMzNCAxIC02NyAtNCAtOTAgLTI3IC0xNDIgLTE2IC0zNSAtMzUgLTY4IC00MyAtNzUgLTM0IC0yOCAtMzUgLTU4IC01IC0xMTcKNTIgLTEwMSA2NyAtMTU4IDY2IC0yNjEgLTEgLTEwNCAtMjIgLTE3NiAtNjkgLTI0MCAtMzMgLTQ0IC0zMiAtNzggNSAtMTQ4IDQwCi03OCA1NyAtMTg0IDQyIC0yNjYgLTE3IC05MCAtMjAgLTg2IDUzIC04NiA2MiAwIDY2IDEgNzYgMjcgMTQgMzYgMTMgMTk1IC0xCjI1NyAtNiAyNyAtMjAgNzEgLTMyIDk4IGwtMjEgNDkgMjYgNDggYzc2IDEzOSA3OSAzNTkgNiA1MjggbC0yMCA0NyAyNSA0NgpjOTkgMTgzIDY0IDQzOSAtODEgNTkxIGwtNTggNjEgMyAxNDIgYzQgMTY0IC0xMyAyNjYgLTU4IDM1NyAtNjQgMTI2IC0xNzIKMTU5IC0yNjMgNzkgLTU0IC00NyAtOTIgLTEzOCAtMTIzIC0yOTggLTMgLTE0IC0xMCAtMjIgLTE3IC0xOCAtMTgyIDgwIC0yOTcKODUgLTQ0MyAyMSBsLTU0IC0yNCAtNCAyMiBjLTM2IDE4NSAtODUgMjg1IC0xNTYgMzIyIC00MyAyMSAtNzQgMjQgLTExMyAxMHoKbTc3IC0xNjggYzQyIC03MSA4MSAtMzAxIDU3IC0zMzYgLTUgLTggLTMxIC0xNiAtNTggLTE4IC0yNiAtMiAtNjIgLTggLTgwCi0xMyBsLTMxIC04IC03IDQ5IGMtOCA1OSAyIDE3MiAyMiAyNDggMTQgNTcgNDggMTIxIDYzIDEyMSA1IDAgMjAgLTE5IDM0IC00M3oKbTk2NSAxMCBjNDAgLTY1IDY5IC0yMzkgNTYgLTMzNiBsLTcgLTQ5IC0zMSA4IGMtMTggNSAtNTQgMTEgLTgwIDEzIC0yNyAyCi01MyAxMCAtNTggMTggLTEyIDE3IC0zIDE0MSAxNyAyMjkgMTUgNjQgNTcgMTUwIDc0IDE1MCA0IDAgMTggLTE1IDI5IC0zM3oiLz4KPHBhdGggZD0iTTc3OCAxMzYxIGMtNzMgLTI0IC0xMTYgLTUxIC0xNjUgLTEwNCAtNTUgLTYwIC03NiAtMTIwIC03MSAtMjAxIDUKLTc2IDM1IC0xMjkgMTA2IC0xODMgNjIgLTQ3IDEyNyAtNjMgMjU3IC02MyAxNzIgMCAyNTggMzYgMzI5IDEzOCA0MiA1OSA0OAoxNTUgMTYgMjMwIC0yOSA2OCAtMTExIDE0MyAtMTg4IDE3MyAtODAgMzEgLTIwNyAzNiAtMjg0IDEweiBtMjU3IC0xMDAgYzE2MQotNzEgMTk0IC0yMzIgNjYgLTMxOCAtNDkgLTMzIC05NCAtNDMgLTE5NiAtNDMgLTEwMiAwIC0xNDcgMTAgLTE5NiA0MyAtMTc4CjEyMCAtMzIgMzU2IDIxMSAzNDMgMzkgLTIgODYgLTEyIDExNSAtMjV6Ii8+CjxwYXRoIGQ9Ik04MzggMTE1OSBjLTI1IC0xNCAtMjIgLTQ0IDcgLTY3IDIwIC0xNiAyNCAtMjYgMTkgLTQ5IC03IC0zNiAxNQotNTggNTEgLTQ5IDIxIDUgMjUgMTIgMjUgNDYgMCAyOSA1IDQyIDIwIDUwIDI3IDE1IDI3IDY2IDAgNzUgLTEwIDMgLTI4IDEKLTQwIC01IC0xNCAtNyAtMjYgLTggLTM5IDAgLTIzIDEyIC0yMiAxMiAtNDMgLTF6Ii8+CjxwYXRoIGQ9Ik0zOTcgMTM0OCBjLTkgLTcgLTIzIC0zMCAtMzIgLTUwIC0yMSAtNTMgLTEgLTEwMyA0NyAtMTE2IDQzIC0xMSA2MAotNiA5MiAyNyA0MCA0MSA0MyA4MSAxMSAxMTkgLTIxIDI1IC0zNCAzMiAtNjQgMzIgLTIwIDAgLTQ1IC02IC01NCAtMTJ6Ii8+CjxwYXRoIGQ9Ik0xMjk1IDEzMjggYy0zMiAtMzggLTI5IC03OCAxMSAtMTE5IDMyIC0zMyA0OSAtMzggOTIgLTI3IDQ5IDEzIDY4CjYyIDQ2IDExOCAtMTkgNDcgLTM4IDYwIC04NyA2MCAtMjcgMCAtNDEgLTcgLTYyIC0zMnoiLz4KPC9nPgo8L3N2Zz4K';


export {OLLAMA_PLUGIN_LOGO_BASE64};
