#!/bin/bash

###
# Usage:
# > sh ./dump_demodata.sh
###

python /app/src/manage.py dumpdata \
    accounts.user \
    authorizations.applicatie \
    authorizations.authorizationsconfig \
    notifications.notificationsconfig \
    vng_api_common.jwtsecret \
    datamodel.kanaal --indent 2 --format json > /app/demodata/demodata.json
