#!/bin/bash

###
# Usage:
# > sh ./dump_demodata.sh
###

python /app/src/manage.py dumpdata \
    accounts.user \
    catalogi.catalogus \
    authorizations.applicatie \
    vng_api_common.jwtsecret \
    catalogi.zaaktype \
    catalogi.statustype \
    catalogi.eigenschapspecificatie \
    catalogi.eigenschap \
    catalogi.roltype \
    catalogi.informatieobjecttype \
    catalogi.zaaktypeinformatieobjecttype \
    zgw_consumers.service --indent 2 --format json > /app/demodata/demodata.json
