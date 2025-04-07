# Create CA
openssl genrsa -out ca.key 2048
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.pem -subj "/CN=Test CA"

# Create PKCS#8 private key
openssl pkcs8 -topk8 -inform PEM -outform PEM -in ca.key -out ca-pkcs8.key -nocrypt

# Server key and cert
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -subj "/CN=mockserver.local"
openssl x509 -req -in server.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out server.crt -days 3650

# Client key and cert
openssl genrsa -out client.key 2048
openssl req -new -key client.key -out client.csr -subj "/CN=springboot-client"
openssl x509 -req -in client.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out client.crt -days 3650

# Convert to PKCS12 keystores for Java
openssl pkcs12 -export -out server-keystore.p12 -inkey server.key -in server.crt -certfile ca.pem -password pass:password
openssl pkcs12 -export -out client-keystore.p12 -inkey client.key -in client.crt -certfile ca.pem -password pass:password

# Convert cert and key to base64
base64 -i server.crt -o server.crt.base64
base64 -i client.crt -o client.crt.base64
base64 -i client.key -o client.key.base64
