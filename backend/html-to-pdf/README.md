# HTML to PDF plugin

For generating PDF documents from HTML sources based on [openhtmltopdf](https://github.com/danfickle/openhtmltopdf)

## Capabilities

This plugin can access Valtimo HTML to PDF webservices to generate PDF documents 

### Running the example application

#### Start docker

Make sure docker is running. Then use the following commands:

#### Start backend

By gradle script:

`Plugins -> backend -> app -> Tasks -> application -> bootRun`

#### Keycloak users

The example application has a few test users that are preconfigured.

| Name | Role | Username | Password |
|---|---|---|---|
| James Vance | ROLE_USER | user | user |
| Asha Miller | ROLE_ADMIN | admin | admin |
| Morgan Finch | ROLE_DEVELOPER | developer | developer |

## Source code

The source code is split up into 2 modules:

1. [Frontend](./frontend)
2. [Backend](./backend)
