# BRP plugin

For fetching data from Haal Centraal, based on a persons BSN.

## Capabilities

This BRP plugin has two actions:

1. Send message to Slack channel.
2. Send message to Slack channel with attachment.

## Example application

This project also contains a working example application which is meant to showcase the BRP plugin.

### Running the example application

#### Start docker

Make sure docker is running. Then use the following commands:

```shell
cd brp
docker compose up
```

#### Start frontend

```shell
cd brp/frontend
npm install
npm run start
```

#### Start backend

By gradle script:

`Plugins -> brp -> backend -> app -> Tasks -> application -> bootRun`

Or use commend line:

```shell
brew install gradle

cd brp/backend/app
gralde bootRun
```

#### Keycloak users

The example application has a few test users that are preconfigured.

| Name | Role | Username | Password |
|---|---|---|---|
| James Vance | ROLE_USER | user | user |
| Asha Miller | ROLE_ADMIN | admin | admin |
| Morgan Finch | ROLE_DEVELOPER | developer | developer |

## Source code

The source code is split up into 2 modules:

1. [Frontend](/frontend)
2. [Backend](/backend)
