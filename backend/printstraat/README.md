# Printstraat Plugin

A Valtimo plugin that collects a **single document** from the **Documenten API** and sends it to **Printstraat**.

## What it does

- Reads a process variable containing a **document URL**.
- Downloads the document via the configured **Documenten API** plugin configuration.
- Base64-encodes the file and posts it to **Printstraat**.
- On failure, throws a BPMN error with code `PRINTSTRAAT_ERROR`.

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

| Parameter | Type | Required | Description                                             |
| --- | --- | :---: |---------------------------------------------------------|
| `documentenApiPluginConfigurationId` | `String` | ✓ | Plugin configuration ID used to call the Documenten API |
| `zaaknummer` | `String` | ✓ | Zaaknummer to send to Printstraat                       |
| `documentUrl` | `String` | ✓ | Document URL                                            |

---

## Expected process variable

`documentUrl` must reference a **URI** representing a single document.

Example:

```text
http://localhost:8001/documenten/api/v1/enkelvoudiginformatieobjecten/a9cdfb0e-30d5-4101-a75c-ecd3cc204ce0
```

## Implementation notes

- Files are base64-encoded (`InputStream` → Base64) before sending.
- `documentenApiPluginConfigurationId` is passed to `DocumentenApiService.downloadInformatieObject(...)`.
- The plugin sends exactly one document per action invocation.
- To send multiple documents, model the service task as a **BPMN multi-instance**:
    - Use **sequential** multi-instance execution for a controlled, ordered upload and simpler retry behavior.
    - Use **parallel** multi-instance execution if higher throughput is required.
    - This approach enables **per-document retries** and avoids partial failures when sending multiple files.
