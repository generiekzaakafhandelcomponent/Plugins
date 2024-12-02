--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: accounts_user; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.accounts_user VALUES (1, 'pbkdf2_sha256$260000$PINGrXbEuTXfDccVDSVGua$QFUBURai3eTcknSmBvaQZpzHHJfwI7rYd++N5xId4j8=', NULL, true, 'admin', '', '', 'admin@admin.org', true, true, '2024-11-04 15:05:01.029862+00');
INSERT INTO public.accounts_user VALUES (2, 'pbkdf2_sha256$150000$5dnJUqLDsmX0$EEbO4AGZqyp88ZCTu+7W2uGRLkdidlL4HkXWc8ZfZV8=', NULL, true, 'demo', 'Valtimo', 'Demo', 'demo@valtimo.nl', true, true, '2024-11-04 14:45:51.796139+00');


--
-- Data for Name: authorizations_applicatie; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.authorizations_applicatie VALUES (1, '377e8200-f9e0-4282-8167-e686baa8f08d', '{valtimo_client}', 'Valtimo', true);
INSERT INTO public.authorizations_applicatie VALUES (2, '1765318d-df37-43db-9612-7751bf206bda', '{opennotificaties}', 'Open notificaties', true);
INSERT INTO public.authorizations_applicatie VALUES (3, 'fb29f94d-4fbe-4b55-a79a-78c3ec1ae9cf', '{openformulieren}', 'Open Formulieren', true);


--
-- Data for Name: catalogi_catalogus; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_catalogus VALUES (1, 'valtimo', '8225508a-6840-413e-acc9-6422af120db1', 'VAL', '002564440', 'Valtimo Demo', '06-12345678', 'demo@valtimo.nl', '_etag', NULL, '');


--
-- Data for Name: catalogi_eigenschapspecificatie; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_eigenschapspecificatie VALUES (1, 'tekst', 'tekst', '100', '1', '{}');


--
-- Data for Name: catalogi_zaaktype; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_zaaktype VALUES (1, '2021-01-01', NULL, false, '744ca059-f412-49d4-8963-5800e4afd486', 'bezwaar-behandelen', 'Bezwaar behandelen', 'Bezwaar behandelen', 'zaakvertrouwelijk', 'Een uitspraak doen op een ingekomen bezwaar tegen een eerder genomen besluit.', 'Er is een bezwaarschrift ontvangen tegen een besluit dat genomen is door de gemeente.', 'Conform de Algemene Wet Bestuursrecht (AWB) heeft een natuurlijk of niet-natuurlijk persoon de mogelijkheid om bezwaar te maken tegen een genomen besluit van de gemeente, bijvoorbeeld het niet verlenen van een vergunning.', 'extern', 'Indienen', 'Bezwaar', 'Behandelen', '84 days', NULL, false, true, '42 days', '{bezwaar,bezwaarschrift}', false, '', '{}', '2021-01-01', '{https://github.com/valtimo-platform/valtimo-platform}', 'https://selectielijst.openzaak.nl/api/v1/procestypen/e1b73b12-b2f6-4c4e-8929-94f84dd2a57d', 'Bezwaar behandelen', 'http://www.gemmaonline.nl/index.php/Referentieproces_bezwaar_behandelen', 1, 2017, '_etag', '002564440', '', '', '', '', '', '');


--
-- Data for Name: catalogi_statustype; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_statustype VALUES (2, '5169f9e9-b49b-4003-a508-df09575aa9f9', 'Intake afgerond', 'Intake afgerond', 1, true, 'Geachte heer/mevrouw, Op %ZAAK. Registratiedatum% heeft u een bezwaar ingediend. Uw bezwaar is bij ons in behandeling genomen onder zaaknummer %ZAAK. Zaakidentificatie%. Wij vragen u dit zaaknummer te gebruiken in geval van correspondentie over dit bezwaar cq. deze zaak.  U wordt per e-mail op de hoogte gehouden van de status van de behandeling van uw bezwaar.', 'Initiële status van de zaak waarbij het bezwaarschrift ontvangen is en naar aanleiding daarvan de zaak aangemaakt en de behandelaar bepaald is. De indiener is een ontvangstbevestiging van zijn (of haar) bezwaar gezonden.', 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_statustype VALUES (3, 'ff89cbe2-49ea-4182-bb21-da8d4a04e6ca', 'Indieningsvereisten getoetst', 'Indieningsvereisten getoetst', 2, true, 'Geachte heer/mevrouw, Op %ZAAK.Registratiedatum% heeft u een bezwaar ingediend. Uw bezwaar is bij ons in behandeling onder zaaknummer %ZAAK.Zaakidentificatie% en is compleet bevonden. Dit houdt in dat wij uw bezwaar gaan beoordelen.  U wordt per e-mail op de hoogte gehouden van de status van de behandeling van uw bezwaar.', 'Het ingediende bezwaar is getoetst op de indieningsvereisten. De uitkomst van deze toets wordt vastgelegd in de eigenschap Uitslag toetsing. Indien er niet aan de indieningseisen wordt voldaan, dan wordt het bezwaar niet-ontvankelijk verklaard en kunnen de volgende vier statussen worden overgeslagen.', 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_statustype VALUES (4, '6d793ae5-db9f-41f8-bf7e-4a7caa9326c4', 'Bezwaar beoordeeld', 'Bezwaar beoordeeld', 3, true, 'Geachte heer/mevrouw, Op %ZAAK.Registratiedatum% heeft u een bezwaar ingediend. Uw bezwaar is bij ons in behandeling onder zaaknummer %ZAAK.Zaakidentificatie%. Wij hebben uw bezwaar beoordeeld en gaan nu de hoorzitting voorbereiden.  U wordt per e-mail op de hoogte gehouden van de status van de behandeling van uw bezwaar.', 'Het ingediende bezwaar is inhoudelijk beoordeeld. Indien gegrond dan is, indien mogelijk, het besluit herroepen of aangepast. Indien niet gegrond dan heeft, indien van toepassing, mediation plaatsgevonden. Indien het besluit als gegrond is beoordeeld of indien mediation heeft geleid tot overeenstemming, dan wordt de volgende status overgeslagen. In het andere geval wordt een statusmelding verzonden.', 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_statustype VALUES (5, 'ff1d3b73-0d87-4abd-a81a-4b4e051311bc', 'Hoorzitting gehouden', 'Hoorzitting gehouden', 4, false, '', 'Er is een verweerschrift opgesteld en verstuurd, een pleitnota is opgesteld en er heeft een hoorzitting plaatsgevonden. De bezwarencommissie heeft een advies uitgebracht.', 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_statustype VALUES (6, 'eda60181-8f09-4b58-84d3-f2550be528bb', 'Concept-besluit opgesteld', 'Concept-besluit opgesteld', 5, false, '', 'Het conceptbesluit voor de beslisser is opgesteld, indien van toepassing op basis van het advies van de bezwarencommissie.', 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_statustype VALUES (7, 'd9ab722c-2e3b-4760-8ec0-3ebf72363b6d', 'Besluit vastgesteld', 'Besluit vastgesteld', 6, true, 'Geachte heer/mevrouw, Op %ZAAK.Registratiedatum% hebben wij heeft u een bezwaar ingediend. Uw bezwaar is bij ons in behandeling onder zaaknummer %ZAAK.Zaakidentificatie%.  De gemeente heeft een besluit genomen over uw bezwaar onder besluitnummer %BESLUIT. Besluitidentificatie%.  Het besluit van de gemeente is:  %BESLUIT.Toelichting%  Het schriftelijke besluit op uw bezwaar inclusief motivatie wordt zo spoedig mogelijk per post naar u toegestuurd.', 'De uitspraak op het bezwaar is vastgesteld door de beslisser.', 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_statustype VALUES (8, '99115d8c-a2d5-4f9d-9592-a7160d5fbbbb', 'Zaak afgerond', 'Zaak afgerond', 7, true, 'Geachte heer/mevrouw, Op %ZAAK. Registratiedatum% heeft u een bezwaar ingediend. Uw bezwaar is bij ons in behandeling onder zaaknummer %ZAAK.Zaakidentificatie%. Onlangs bent u al op de hoogte gesteld van het besluit. Met deze e-mail willen wij u mededelen dat het besluit per post naar u is toegestuurd en dat wij de zaak hebben afgesloten.', 'Het besluit is schriftelijk kenbaar gemaakt aan de indiener van het bezwaar. De zaak is gearchiveerd en afgehandeld.', 1, '_etag', NULL, NULL, NULL);


--
-- Data for Name: catalogi_eigenschap; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_eigenschap VALUES (1, 'e4ace2d9-4ef2-44c8-94a8-d5dfa12e4f1e', 'voornaam', 'voornaam', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (2, '69536ee2-83a5-4eab-ad7a-799c76190171', 'achternaam', 'achternaam', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (3, '4424a4e6-dbb0-41df-90bf-29c54198399f', 'bsn', 'bsn', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (4, '421b88e6-83c5-48d3-9238-3e6904fb3856', 'bezwaar', 'bezwaar', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (5, '96024ef5-85fd-45d9-865f-62650d478547', 'straatnaam', 'straatnaam', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (6, '7fae3cc5-bc94-4072-811c-58f4a5b9e318', 'huisnummer', 'huisnummer', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (7, '67b1794d-f75a-472f-bf7b-c01fa1f9e721', 'toevoeging', 'toevoeging', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (8, '997350f6-2e11-4966-97dd-7f4a1d3fa11f', 'postcode', 'postcode', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (9, '93bc7aa4-6b82-40e2-be8a-c2a0830ab30c', 'plaats', 'plaats', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (10, '706a1a43-d3c2-43ce-8297-5e60d1ba6014', 'telefoonnummer', 'telefoonnummer', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (11, '8232dafd-8c10-4726-b582-17d77e780e06', 'e-mailadres', 'e-mailadres', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (12, 'd1877e6f-9cb6-467c-9a8f-35a16ca0a7ee', 'zaaknummer', 'zaaknummer', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (13, '1a993d1f-aa14-4772-987a-63f8d5ed227b', 'datumBesluit', 'datumBesluit', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (14, '67f7aaa9-f4d3-45a0-a6aa-05fe0fe699bc', 'besluit', 'besluit', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (15, '1887dbf5-001f-4d3a-943a-1a93d8a85827', 'communicatie', 'communicatie', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (16, '9f35b1dc-6169-4718-a505-ac0bce3dea2d', 'beslissingBezwaar', 'beslissingBezwaar', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (17, '810fc646-0aa7-4462-8a61-7bd58349a9bd', 'naamBehandelaar', 'naamBehandelaar', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (18, '5eb0f4dd-b755-4793-a67e-dfdb9e12834c', 'e-mailBehandelaar', 'e-mailBehandelaar', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (19, '7e4112c1-23ed-4905-814c-7895bcca1495', 'aanvraagAanvulInfo', 'aanvraagAanvulInfo', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (20, '036831ae-49c9-4bdb-b2c6-89579230b15d', 'aanvullendeInfo', 'aanvullendeInfo', '', 1, 1, '_etag', NULL, NULL, NULL);
INSERT INTO public.catalogi_eigenschap VALUES (21, 'b33b8b4d-1e83-4084-bf9a-c78bd7223931', 'naamBeslisser', 'naamBeslisser', '', 1, 1, '_etag', NULL, NULL, NULL);


--
-- Data for Name: catalogi_informatieobjecttype; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_informatieobjecttype VALUES (1, '2021-10-04', NULL, false, 'efc332f2-be3b-4bad-9e3c-49a6219c92ad', 'test', 'zaakvertrouwelijk', 1, '_etag', '', '', '', '', '', '{}', 'onbekend');


--
-- Data for Name: catalogi_roltype; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_roltype VALUES (1, '1c359a1b-c38d-47b8-bed5-994db88ead61', 'Aanvrager', 'initiator', 1, '_etag', NULL, NULL);


--
-- Data for Name: catalogi_zaaktypeinformatieobjecttype; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.catalogi_zaaktypeinformatieobjecttype VALUES (1, '405da8a9-7296-439c-a2eb-a470b84f17ee', 1, 'inkomend', 1, NULL, 1, '_etag');


--
-- Data for Name: vng_api_common_jwtsecret; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.vng_api_common_jwtsecret VALUES (1, 'valtimo_client', 'e09b8bc5-5831-4618-ab28-41411304309d');
INSERT INTO public.vng_api_common_jwtsecret VALUES (2, 'opennotificaties', 'opennotificaties');
INSERT INTO public.vng_api_common_jwtsecret VALUES (3, 'openformulieren', 'openformulieren');


--
-- Data for Name: zaken_zaakidentificatie; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.zaken_zaakidentificatie VALUES (1, 'ZAAK-2021-0000000001', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (2, 'ZAAK-2021-0000000002', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (3, 'ZAAK-2021-0000000003', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (4, 'ZAAK-2021-0000000004', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (5, 'ZAAK-2021-0000000005', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (6, 'ZAAK-2021-0000000006', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (7, 'ZAAK-2021-0000000007', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (8, 'ZAAK-2021-0000000008', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (9, 'ZAAK-2021-0000000009', '100000009');
INSERT INTO public.zaken_zaakidentificatie VALUES (10, 'ZAAK-2024-0000000001', '100000009');


--
-- Data for Name: zgw_consumers_service; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.zgw_consumers_service VALUES (1, 'Notificaties API', 'nrc', 'https://notificaties-api.vng.cloud/api/v1/', '', '', 'no_auth', '', '', 'https://notificaties-api.vng.cloud/api/v1/schema/openapi.yaml', '', '', '', '', NULL, NULL, 'd2b82dc4-0b2e-4b09-bfb5-2d3de518f4f2');
INSERT INTO public.zgw_consumers_service VALUES (2, 'VNG Selectielijst', 'orc', 'https://selectielijst.openzaak.nl/api/v1/', '', '', 'no_auth', '', '', 'https://selectielijst.openzaak.nl/api/v1/schema/openapi.yaml', '', '', '', '', NULL, NULL, '416b1d93-b596-44c3-b226-d2aca2184b7d');


--
-- Data for Name: zaken_zaak; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.zaken_zaak VALUES (1, '703af290-abe0-418c-b9c3-10a65e662788', 'ZAAK-2021-0000000001', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 1, '_etag', '051845623', NULL, NULL, 1, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (2, '60b30357-e81c-40f7-80cf-cd715e01a981', 'ZAAK-2021-0000000002', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 2, '_etag', '051845623', NULL, NULL, 2, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (3, '59a4e114-cc09-4a09-b324-63ec7e18a896', 'ZAAK-2021-0000000003', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 3, '_etag', '051845623', NULL, NULL, 3, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (4, 'ba439c9a-5a2d-46da-bb30-7827bd672382', 'ZAAK-2021-0000000004', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 4, '_etag', '051845623', NULL, NULL, 4, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (5, '1e1cb360-f6d3-4c2a-b815-119f09aaa95d', 'ZAAK-2021-0000000005', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 5, '_etag', '051845623', NULL, NULL, 5, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (6, 'f621749d-d222-49b8-9392-eff8723e0922', 'ZAAK-2021-0000000006', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 6, '_etag', '051845623', NULL, NULL, 6, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (7, '8c0243f2-6f2c-4757-940a-5140d71b74a0', 'ZAAK-2021-0000000007', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 7, '_etag', '051845623', NULL, NULL, 7, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (8, '7b18aa8c-968f-427e-9875-d827bbdc9624', 'ZAAK-2021-0000000008', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 8, '_etag', '051845623', NULL, NULL, 8, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (9, '64eaf9ef-37b4-4898-acc9-ae47bee577a2', 'ZAAK-2021-0000000009', '051845623', '', '', '2024-11-04', '051845623', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', NULL, false, '', '', NULL, 'nog_te_archiveren', NULL, 1, 9, '_etag', '051845623', NULL, NULL, 9, '', '', '', '', '', NULL);
INSERT INTO public.zaken_zaak VALUES (NULL, '239e1863-6516-492d-a691-4e85e45dd4f4', '', '', '', '', '2024-11-04', '100000009', '2024-11-04', NULL, NULL, NULL, NULL, '{}', '', 'openbaar', '', NULL, NULL, '', '00:00:00', false, '', '', NULL, 'nog_te_archiveren', NULL, 1, NULL, '771598e6d588b6d3f661e745a662588a', '', NULL, NULL, 10, '', '', '', '', '', NULL);


--
-- Data for Name: zaken_rol; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.zaken_rol VALUES (1, '6a5959f6-64c4-4b12-9092-d042ae269ba2', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.933363+00', 'gemachtigde', 1, 1, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (2, 'e0a8eb00-98e3-4152-b4c0-a680c1bed966', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.934596+00', 'gemachtigde', 1, 2, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (3, '06aa5a31-387a-4ed3-8f15-5e9be832ef1f', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.935796+00', 'gemachtigde', 1, 3, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (4, 'cb86065d-86a7-4933-a6bf-7ea15c8f9132', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.936872+00', 'gemachtigde', 1, 4, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (5, '7315f0e1-fec6-430b-923c-2a4fecb6abd8', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.938017+00', 'gemachtigde', 1, 5, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (6, '79bb6761-e835-4fa8-92f5-61166bb4c5a0', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.939188+00', 'gemachtigde', 1, 6, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (7, 'f82037f1-f1cf-4c4b-809b-319e1aa7bb6a', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.93998+00', 'gemachtigde', 1, 7, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (8, '129f37c5-1e8b-43a1-9514-c7d9c57a0b8b', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.941013+00', 'gemachtigde', 1, 8, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (9, '10684831-cef6-43e5-aebc-455dd8585714', '1', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Test rol', '2024-11-04 14:45:51.942119+00', 'gemachtigde', 1, 9, '_etag', NULL, NULL, '', '', '', '', '');
INSERT INTO public.zaken_rol VALUES (10, '8d68e2db-cfbb-419c-a035-769fb3f4b0ef', '', 'natuurlijk_persoon', 'Aanvrager', 'initiator', 'Aanvrager', '2024-11-04 14:54:13.209889+00', '', 1, 10, '634b951b504ea34c0ca504e5ea5f14ed', NULL, NULL, '', '', '', '', '');


--
-- Data for Name: zaken_natuurlijkpersoon; Type: TABLE DATA; Schema: public; Owner: openzaak
--

INSERT INTO public.zaken_natuurlijkpersoon VALUES (1, '569312863', '', '', '', '', '', '', 'm', '', 1, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (2, '569312863', '', '', '', '', '', '', 'm', '', 2, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (3, '569312863', '', '', '', '', '', '', 'm', '', 3, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (4, '569312863', '', '', '', '', '', '', 'm', '', 4, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (5, '569312863', '', '', '', '', '', '', 'm', '', 5, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (6, '569312863', '', '', '', '', '', '', 'm', '', 6, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (7, '569312863', '', '', '', '', '', '', 'm', '', 7, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (8, '569312863', '', '', '', '', '', '', 'm', '', 8, NULL, NULL);
INSERT INTO public.zaken_natuurlijkpersoon VALUES (9, '569312863', '', '', '', '', '', '', 'm', '', 9, NULL, NULL);


--
-- Name: accounts_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.accounts_user_id_seq', 2, true);


--
-- Name: authorizations_applicatie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.authorizations_applicatie_id_seq', 3, true);


--
-- Name: catalogi_catalogus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_catalogus_id_seq', 1, true);


--
-- Name: catalogi_eigenschap_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_eigenschap_id_seq', 21, false);


--
-- Name: catalogi_eigenschapspecificatie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_eigenschapspecificatie_id_seq', 1, false);


--
-- Name: catalogi_informatieobjecttype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_informatieobjecttype_id_seq', 1, false);


--
-- Name: catalogi_roltype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_roltype_id_seq', 1, false);


--
-- Name: catalogi_statustype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_statustype_id_seq', 8, false);


--
-- Name: catalogi_zaaktype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_zaaktype_id_seq', 1, false);


--
-- Name: catalogi_zaaktypeinformatieobjecttype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.catalogi_zaaktypeinformatieobjecttype_id_seq', 1, false);


--
-- Name: vng_api_common_jwtsecret_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.vng_api_common_jwtsecret_id_seq', 3, true);


--
-- Name: zaken_natuurlijkpersoon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.zaken_natuurlijkpersoon_id_seq', 9, true);


--
-- Name: zaken_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.zaken_rol_id_seq', 10, true);


--
-- Name: zaken_zaakidentificatie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.zaken_zaakidentificatie_id_seq', 10, true);


--
-- Name: zgw_consumers_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openzaak
--

SELECT pg_catalog.setval('public.zgw_consumers_service_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

