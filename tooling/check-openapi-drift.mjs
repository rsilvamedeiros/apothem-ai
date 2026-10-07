#!/usr/bin/env node
// Fails when packages/api-client/openapi.json differs from apothem-api's spec.
// Skips (exit 0) when the sibling checkout is absent, e.g. standalone CI.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { specsMatch } from "./openapi-drift.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const vendored = path.join(dir, "../packages/api-client/openapi.json");
const source = path.join(dir, "../../apothem-api/openapi/openapi.json");

if (!existsSync(source)) {
  console.warn(`apothem-api checkout not found at ${source}; skipping drift check.`);
  process.exit(0);
}

if (!specsMatch(readFileSync(vendored, "utf-8"), readFileSync(source, "utf-8"))) {
  console.error(
    "Vendored OpenAPI spec is out of date. Run: npm run sync-and-generate --workspace=packages/api-client",
  );
  process.exit(1);
}
console.log("OpenAPI spec is in sync with apothem-api.");
