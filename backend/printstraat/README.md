# Printstraat Plugin

A Valtimo plugin that collects a **single document** from the **Documenten API** and sends it to **Printstraat**.

## What it does

- Reads a process variable containing **JSON metadata of a single document**.
- Downloads the document via the configured **Documenten API** plugin configuration.
- Base64-encodes the file and posts it to **Printstraat**.
- Uses a deterministic unique filename (`"<documentId> - <documentName>"`) to avoid duplicate uploads.
- On failure, throws a BPMN error with code `PrintstraatError`.

---

## Plugin definition

**Key:** `printstraat`  
**Action:** `send-file-to-printstraat` – *Send file to Printstraat*

### Plugin properties

| Property | Type | Secret | Description |
| --- | --- | :---: | --- |
| `url` | `URI` | ✗ | Base URL of the Printstraat endpoint |
| `token` | `String` | ✓ | API token for Printstraat |

### Action input parameters

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| `documentenApiPluginConfigurationId` | `String` | ✓ | Plugin configuration ID used to call the Documenten API |
| `zaaknummer` | `String` | ✓ | Zaaknummer to send to Printstraat |
| `documentMetadataVariableName` | `String` | ✓ | Name of the process variable that holds the document metadata |

---

## Expected process variable

`documentMetadataVariableName` must reference a **JSON object** representing a single document and must at least contain `id` and `name`.

Example:

```json
{
  "id": "d7bd5d8e-9e5b-4f78-9e0a-5a5b20a4d8a4",
  "name": "brief.pdf"
} 
```

## Implementation notes

- Files are base64-encoded (`InputStream` → Base64) before sending.
- Filenames are prefixed with the documentId: `"<documentId> - <documentName>"` to avoid duplicate rejections on the Printstraat side.
- `documentenApiPluginConfigurationId` is passed to `DocumentenApiService.downloadInformatieObject(...)`.
- The plugin sends exactly one document per action invocation.
- To send multiple documents, model the service task as a **BPMN multi-instance**:
    - Use **sequential** multi-instance execution for a controlled, ordered upload and simpler retry behavior.
    - Use **parallel** multi-instance execution if higher throughput is required.
    - This approach enables **per-document retries** and avoids partial failures when sending multiple files.
