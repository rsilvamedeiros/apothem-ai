import { listTools, type ApothemApiClient } from "@apothem/api-client";
import { isNetworkError } from "@/lib/mock";
import type { ToolOption } from "./tool-bindings";

export type LoadToolsResult = { kind: "ok"; tools: ToolOption[] } | { kind: "error"; message: string };

/** The editor degrades to a message when the catalog is unavailable; it never guesses tool names. */
export async function loadTools(client: ApothemApiClient): Promise<LoadToolsResult> {
  try {
    const { data, response } = await listTools(client);
    if (response.status === 401) return { kind: "error", message: "You need to sign in again." };
    if (response.status >= 400 || !data) return { kind: "error", message: "The tool catalog could not be loaded." };
    return { kind: "ok", tools: data.tools as ToolOption[] };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "error", message: "apothem-api is unreachable." };
    throw error;
  }
}
