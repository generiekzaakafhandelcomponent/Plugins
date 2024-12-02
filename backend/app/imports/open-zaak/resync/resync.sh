#!/bin/bash

# The pg_dump will extract the data only from the specified tables, if you need more tables you can add them here.

pg_dump --inserts --data-only --host localhost --port 8091 --username openzaak openzaak \
-t accounts_user \
-t catalogi_catalogus \
-t authorizations_applicatie \
-t vng_api_common_jwtsecret \
-t catalogi_zaaktype \
-t catalogi_statustype \
-t catalogi_eigenschapspecificatie \
-t catalogi_eigenschap \
-t catalogi_roltype \
-t catalogi_informatieobjecttype \
-t catalogi_zaaktypeinformatieobjecttype \
-t zgw_consumers_service \
-t zaken_zaakidentificatie \
-t zaken_zaak \
-t zaken_rol \
-t zaken_natuurlijkpersoon > ../database/1-setup-zaaktype.sql


