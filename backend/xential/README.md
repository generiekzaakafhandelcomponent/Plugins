# Xential plugin

For generating documents at xential (https://www.xential.com/documentcreatie)

## Capabilities

This plugin can access Xential webservices, and handle callback requests to store generated documents.


### Running the example application

#### Start docker

Make sure docker is running. Then use the following commands:

```shell
cd suwinet
docker compose up
```

#### Start frontend

```shell
cd frontend
npm use 18 
npm run libs:build:xential
npm start
```

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
