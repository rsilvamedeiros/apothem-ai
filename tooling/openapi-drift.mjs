// Detects drift between the vendored OpenAPI spec in packages/api-client and
// the source of truth in the sibling apothem-api checkout (ADR-008).

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])]),
    );
  }
  return value;
}

export function specsMatch(vendoredText, sourceText) {
  try {
    return (
      JSON.stringify(canonical(JSON.parse(vendoredText))) ===
      JSON.stringify(canonical(JSON.parse(sourceText)))
    );
  } catch {
    return false;
  }
}
