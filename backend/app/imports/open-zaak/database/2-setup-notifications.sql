--
-- Wire Open Zaak to the local Open Notificaties instance.
--
-- Publishing a notification on zaak creation otherwise fails with:
--     RuntimeError: Could not build a client for Notifications API
-- because Open Zaak has no usable "Notificaties API" (api_type 'nrc') service and
-- notifications_api_common_notificationsconfig.notifications_api_service_id is unset.
--
-- Note: different Open Zaak versions seed zgw_consumers_service differently
-- (1.12 seeds an 'nrc' service pointing at the public VNG cloud; 1.13 seeds only
-- the Selectielijst service), so this block creates the 'nrc' service when absent
-- and otherwise repoints the existing one. The id is left to the sequence to avoid
-- colliding with rows Open Zaak seeds itself.
--
-- The credentials (client_id/secret 'openzaak') are the ones Open Notificaties trusts
-- for Open Zaak (see imports/open-notificaties/database/1-setup-notificaties.sql:
-- vng_api_common_jwtsecret 'openzaak' + authorizations_applicatie '{openzaak}').
-- 'open-notificaties' is the docker-compose service hostname; port 8000 is internal.

DO $$
DECLARE
    svc_id integer;
BEGIN
    SELECT id INTO svc_id FROM public.zgw_consumers_service WHERE api_type = 'nrc' LIMIT 1;

    IF svc_id IS NULL THEN
        INSERT INTO public.zgw_consumers_service
            (label, api_type, api_root, client_id, secret, auth_type,
             header_key, header_value, oas, nlx, user_id, user_representation, oas_file, uuid)
        VALUES
            ('Notificaties API', 'nrc', 'http://open-notificaties:8000/api/v1/',
             'openzaak', 'openzaak', 'zgw',
             '', '', 'http://open-notificaties:8000/api/v1/schema/openapi.yaml',
             '', '', '', '', 'd2b82dc4-0b2e-4b09-bfb5-2d3de518f4f2')
        RETURNING id INTO svc_id;
    ELSE
        UPDATE public.zgw_consumers_service
        SET api_root  = 'http://open-notificaties:8000/api/v1/',
            oas       = 'http://open-notificaties:8000/api/v1/schema/openapi.yaml',
            auth_type = 'zgw',
            client_id = 'openzaak',
            secret    = 'openzaak'
        WHERE id = svc_id;
    END IF;

    INSERT INTO public.notifications_api_common_notificationsconfig
        (id, notifications_api_service_id, notification_delivery_max_retries,
         notification_delivery_retry_backoff, notification_delivery_retry_backoff_max)
    VALUES (1, svc_id, 5, 3, 48)
    ON CONFLICT (id) DO UPDATE
        SET notifications_api_service_id = EXCLUDED.notifications_api_service_id;
END $$;
