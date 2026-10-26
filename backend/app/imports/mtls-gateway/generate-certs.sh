#!/usr/bin/env bash
#
# Generates throwaway certificates for the local mTLS gateway (docker-compose service 'mtls-gateway') and writes
# them, together with the plugin configurations that use them, to:
#   - certs/ca.pem, certs/ca-key.pem          : CA that signs the server and client certificate
#   - certs/server.pem, certs/server-key.pem  : certificate the gateway presents (localhost, 127.0.0.1, host.docker.internal)
#   - certs/client.pem, certs/client-key.pem  : client certificate Valtimo presents to the gateway
#   - src/main/resources/config/plugin/mtls-gateway.pluginconfig.json: the certificates of every Http Client
#     Authentication configuration in it
#
# For local testing only. Run from anywhere: ./backend/app/imports/mtls-gateway/generate-certs.sh

set -euo pipefail

GATEWAY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$GATEWAY_DIR/../.." && pwd)"
CERTS_DIR="$GATEWAY_DIR/certs"
PLUGIN_CONFIG="$APP_DIR/src/main/resources/config/plugin/mtls-gateway.pluginconfig.json"
DAYS=36500
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

mkdir -p "$CERTS_DIR"
cd "$CERTS_DIR"

openssl req -x509 -newkey rsa:2048 -nodes -days "$DAYS" \
  -keyout ca-key.pem -out ca.pem \
  -subj "/CN=Http Client Authentication sandbox CA"

cat > "$WORK_DIR/server.ext" <<EOF
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = DNS:localhost, DNS:host.docker.internal, DNS:mtls-gateway, IP:127.0.0.1
EOF
openssl req -newkey rsa:2048 -nodes -keyout server-key.pem -out "$WORK_DIR/server.csr" -subj "/CN=localhost"
openssl x509 -req -in "$WORK_DIR/server.csr" -CA ca.pem -CAkey ca-key.pem -CAcreateserial -CAserial "$WORK_DIR/ca.srl" \
  -days "$DAYS" -extfile "$WORK_DIR/server.ext" -out server.pem

cat > "$WORK_DIR/client.ext" <<EOF
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
EOF
openssl req -newkey rsa:2048 -nodes -keyout client-key.pem -out "$WORK_DIR/client.csr" -subj "/CN=valtimo-sandbox-client"
openssl x509 -req -in "$WORK_DIR/client.csr" -CA ca.pem -CAkey ca-key.pem -CAserial "$WORK_DIR/ca.srl" \
  -days "$DAYS" -extfile "$WORK_DIR/client.ext" -out client.pem

python3 - "$CERTS_DIR" "$PLUGIN_CONFIG" <<'EOF'
import json, pathlib, sys

certs = pathlib.Path(sys.argv[1])
pem = lambda name: (certs / name).read_text()
tls = {
    "clientCertificate": pem("client.pem"),
    "clientPrivateKey": pem("client-key.pem"),
    "serverCertificate": pem("ca.pem"),
}
config_file = pathlib.Path(sys.argv[2])
configs = json.loads(config_file.read_text())
for config in configs:
    if config["pluginDefinitionKey"] == "http-client-authentication-plugin":
        config["properties"].update(tls)
config_file.write_text(json.dumps(configs, indent=4) + "\n")
EOF

echo "Certificates written to $CERTS_DIR"
echo "Plugin configurations written to $PLUGIN_CONFIG"
