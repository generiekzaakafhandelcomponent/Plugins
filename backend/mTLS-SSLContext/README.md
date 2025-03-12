# mTLS SSLContext Plugin

Helper Plugin for initializing your HTTP client with a SSLContext that is populated with configuration to enable mTLS.<br>

Mutual TLS (mTLS) is an extension of the TLS (Transport Layer Security) protocol that enhances security by requiring both the client and the server to authenticate themselves to each other before any data is exchanged. This ensures a bidirectional verification, making mTLS a popular choice for securing server-to-server communication and API endpoints, especially in microservices architectures where services need to securely communicate over a network.

All Configuration input fields are in base64 encoded strings, all fields are required, these are:
* Server certificate
* Client private key
* Client certificate

Currently most settings are hardcoded, this might become configurable in the future.
* the Keystore and Truststore use type <strong>PKCS12</strong>
* The key factory is of type <strong>RSA</strong>
* The Certificate Factory is of type <strong>X.509</strong>

For more details see documentation [SSLContext Documentation](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/javax/net/ssl/SSLContext.html)

## Source code

The source code is split up into 2 modules:

1. [Frontend](./../../frontend/projects/valtimo-plugins/mtls-sslcontext)
2. [Backend](./)
