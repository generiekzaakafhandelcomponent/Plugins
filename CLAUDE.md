# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **GZAC Valtimo Plugins** repository containing optional plugins for the GZAC/Valtimo platform. Plugins are published to Maven Central under `com.ritense.valtimoplugins` group ID and npm as `@valtimo-plugins/*`.

Documentation: https://docs.valtimo.nl/features/plugins

## Build Commands

### Backend (Kotlin/Spring Boot)
```bash
# Build all backend plugins
./gradlew build

# Run unit tests (excludes integration tests)
./gradlew test

# Run integration tests (requires Docker)
./gradlew integrationTesting

# Run a single plugin's tests
./gradlew :backend:sample-plugin:test

# Run the sandbox app (requires Docker for dependencies)
./gradlew :backend:app:bootRun
```

### Frontend (Angular 17)
```bash
cd frontend

# Install dependencies (Node 20, run in order)
nvm use 20
npm install --legacy-peer-deps
npm run libs-build-all
npm install

# Start dev server
npm start

# Build a specific plugin library
npm run libs:build:sample-plugin

# Watch a specific plugin during development
npm run libs:watch:sample-plugin
```

## Architecture

Each plugin consists of two components:
- **Backend** (`backend/<plugin-name>/`) - Kotlin/Spring Boot module providing the plugin logic, API integrations, and BPMN actions
- **Frontend** (`frontend/projects/valtimo-plugins/<plugin-name>/`) - Angular library providing configuration UI components

Both components must be implemented and their plugin IDs must match.

A plugin has:
- **Plugin configuration** - Settings for the plugin instance (e.g., API URL, credentials)
- **Plugin actions** (optional) - Methods that can be linked to BPMN service tasks to execute plugin functionality during process execution

### Backend Plugin Structure
Each backend plugin in `backend/<plugin-name>/` follows this pattern:

1. **Plugin class** with `@Plugin` annotation defining metadata and `@PluginAction` methods
2. **PluginFactory** extending `PluginFactory<T>` for instantiation
3. **AutoConfiguration** class with `@AutoConfiguration` for Spring bean registration
4. **Auto-configuration registration** at `src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`
5. **Plugin-specific `gradle/publishing.gradle`** for Maven Central publication

Key annotations:
- `@Plugin(key, title, description)` - Defines the plugin, `key` must match frontend `pluginId`
- `@PluginProperty(key, secret)` - Configuration properties
- `@PluginAction(key, title, description, activityTypes)` - Actions invoked from BPMN processes

Dependencies use Valtimo BOM: `com.ritense.valtimo:valtimo-dependency-versions:${valtimoVersion}`

### Frontend Plugin Structure
Each frontend plugin in `frontend/projects/valtimo-plugins/<plugin-name>/` contains:

1. **Specification file** (`sample-plugin.specification.ts`) - Defines `pluginId` (must match backend `@Plugin.key`), configuration components, logo, and translations
2. **Module** - Angular module exporting components
3. **Configuration components** - For plugin config and action config
4. **public_api.ts** - Exports for the library

Frontend plugins are Angular libraries built with ng-packagr.

### Plugin ID Matching
The backend `@Plugin(key = "...")` must exactly match the frontend `pluginId` in the specification.

### Sandbox Application
`backend/app/` is a test application that loads all plugins. Environment variables are loaded from `.env.properties` (copy from `.env.properties.example`).

Test users (Keycloak):
- user/user (ROLE_USER)
- admin/admin (ROLE_ADMIN)
- developer/developer (ROLE_DEVELOPER)

## Tech Stack

- Java 17, Kotlin
- Spring Boot 3.2.x
- Valtimo 12.14.x
- Angular 17.2.x
- Node 20 (LTS Iron)
