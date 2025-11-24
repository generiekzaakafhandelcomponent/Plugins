### ValueMapper Plugin

The ValueMapper plugin copies values from a source JSON to a target JSON, with optional transformations. You define rules (commands) with a source path, a target path, and optionally transformations. The first transformation that applies is executed.

### What you can do
- Copy a value from `sourcePointer` to `targetPointer`.
- Automatically create missing paths in the target.
- Apply a transformation to the value (e.g., copy with different value or type conversion).
- Conditionally skip a mapping with a SpEL `skipCondition`.

### Core objects
- `ValueMapper`: executes mapping rules on `source: JsonNode` and `target: ObjectNode`.
- `ValueMapperCommand` with fields:
    - `sourcePointer: String` (JSON Pointer, e.g., `/person/firstName`)
    - `targetPointer: String` (e.g., `/name/given`)
    - `transformations: List<ValueMapperTransformation>?` (optional)
- `ValueMapperTransformation` (abstract):
    - `canTransform(node: JsonNode): Boolean`
    - `transform(value: Any): Pair<Boolean, Any?>` → `didSkip` and result

### Available transformations
- `CopyTransformation(when: Any, then: Any? = null, skipCondition: String? = null)`
    - Active when the source value equals `when` (after JSON→Kotlin conversion).
    - Sets `then` as the result, otherwise the original value.
    - `skipCondition` is a SpEL expression; when true, this command is skipped.
- `TypeTransformation(whenType: JsonNodeType, thenType: String)`
    - Active when `node.nodeType == whenType`.
    - Converts the value to `thenType` (class name, e.g., `java.lang.String`).

### Example 1: simple copy (no transformations)
```json
{
  "commands": [
    {
      "sourcePointer": "/person/firstName",
      "targetPointer": "/name/given"
    }
  ]
}
```

### Example 2: conditional copy with CopyTransformation
```json
{
  "commands": [
    {
      "sourcePointer": "/status",
      "targetPointer": "/state",
      "transformations": [
        {
          "type": "CopyTransformation",
          "when": "active",
          "then": "enabled",
          "skipCondition": "${it == null}"
        }
      ]
    }
  ]
}
```
- If source is `null` → skip.
- If source is "active" → write "enabled".

### Example 3: type conversion with TypeTransformation
```json
{
  "commands": [
    {
      "sourcePointer": "/amount",
      "targetPointer": "/amountAsText",
      "transformations": [
        {
          "type": "TypeTransformation",
          "whenType": "NUMBER",
          "thenType": "java.lang.String"
        }
      ]
    }
  ]
}
```

### SpEL `skipCondition`
- Template syntax: `${ ... }`.
- Variable `it` contains the current source value.
- Examples: `${it == null}`, `${it > 100}`.

### Error handling (short)
- `targetPointer == "/"` → error (root cannot be overwritten).
- Source path doesn’t exist or no transformation matches → command is logged as skipped.
- Array transformation → `ValueMapperMappingException`.

### Recent additions
- `CopyTransformation` (with SpEL-based `skipCondition`) and `TypeTransformation`.
- Clear semantics: `null` transformation list copies; empty list skips.
