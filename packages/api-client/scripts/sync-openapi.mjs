#!/usr/bin/env node
// Copies the OpenAPI spec from the sibling apothem-api checkout, when present,
// so `openapi.json` in this package can be regenerated locally. It is
// otherwise a checked-in vendored copy — apothem-api is the source of truth
// (ADR-008 / monorepo-architecture.md), this script just keeps the copy fresh.
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(dir, "../openapi.json");
const source = path.join(dir, "../../../../apothem-api/openapi/openapi.json");

if (!existsSync(source)) {
  console.warn(
    `apothem-api sibling checkout not found at ${source}; keeping the vendored openapi.json as-is.`,
  );
  process.exit(0);
}

copyFileSync(source, target);
console.log(`Synced openapi.json from ${source}`);
