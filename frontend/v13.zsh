#!/bin/zsh

#curl -L https://github.com/valtimo-platform/valtimo-frontend-libraries/archive/refs/tags/13.0.1.zip \
#  -o valtimo-migration.zip && \
#unzip -q valtimo-migration.zip 'valtimo-frontend-libraries-13.0.1/migration/*' && \
#mv valtimo-frontend-libraries-13.0.1/migration ./migration && \
#rm -rf valtimo-frontend-libraries-13.0.1 valtimo-migration.zip && \
VALTIMO_DEPS_SOURCE="https://raw.githubusercontent.com/valtimo-platform/valtimo-frontend-libraries/refs/tags/13.0.1/package.json" \
VALTIMO_VERSION="13.0.1" \
node migration/12-13/migrate.cjs
