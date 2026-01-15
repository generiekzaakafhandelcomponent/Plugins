# Printstraat Plugin

A Valtimo plugin that collects files (by ID) from the **Documenten API** and sends them to **Printstraat**.

## What it does

- Reads a process variable containing a JSON list of document IDs (and names).
- Downloads each document via the configured **Documenten API** plugin configuration.
- Base64-encodes the file and posts it to **Printstraat** with a unique file name.
- On failure, throws a BPMN error `PrintstraatError`.

---

## Plugin definition

**Key:** `printstraat`  
**Action:** `send-files-to-printstraat` – *Sends the files to Printstraat*

### Plugin properties

| Property | Type | Secret | Description |
| --- | --- | :---: | --- |
| `url` | `URI` | ✗ | Base URL of the Printstraat endpoint |
| `token` | `String` | ✓ | API token for Printstraat |

### Action input parameters

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `documentenApiPluginConfigurationId` | `String` | ✓ | Plugin configuration ID used to call the Documenten API |
| `documentenListVariableName` | `String` | ✓ | Name of the process variable that holds the JSON list of files to send |

---

## Expected process variable

`documentenListVariableName` must reference a **JSON array** of objects that at least contain `id` and `name`:

```json
[
  { "id": "d7bd5d8e-9e5b-4f78-9e0a-5a5b20a4d8a4", "name": "brief.pdf" },
  { "id": "5b6a2e34-3c83-4d6b-9b68-1d4a9a27c0f2", "name": "bijlage.pdf" }
]
```
---

## Implementation notes

- Files are base64-encoded (`InputStream` → Base64) before sending.
- Filenames are prefixed with a random UUID: `"<uuid> - <originalName>"` to avoid duplicate rejections on the Printstraat side.
- `documentenApiPluginConfigurationId` is passed to `DocumentenApiService.downloadInformatieObject(...)`.
