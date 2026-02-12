# Example application

This project also contains a working example application which is meant to showcase all plugins.

## Running the example application

### Prerequisites
- Java 21
- [Docker (Desktop)](https://www.docker.com/products/docker-desktop/)

### Start docker

Make sure docker is running.

Start with gradle script:

`Plugins -> backend -> app -> Tasks -> docker -> composeUp`

Or use commend line:

```shell
cd backend/app
docker compose up
```

### Start backend

By gradle script:

`Plugins -> backend -> app -> Tasks -> application -> bootRun`

Or use commend line:

```shell
./graldew :app:backend:bootRun
```

### Keycloak users

The example application has a few test users that are preconfigured.

| Name | Role | Username | Password |
|---|---|---|---|
| James Vance | ROLE_USER | user | user |
| Asha Miller | ROLE_ADMIN | admin | admin |
| Morgan Finch | ROLE_DEVELOPER | developer | developer |

# Source code

The source code is split up into 2 modules:

1. [Frontend](/frontend)
2. [Backend](/backend)
