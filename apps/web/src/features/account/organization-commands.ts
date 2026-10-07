import { createOrganization, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import { isValidSlug, slugify } from "@/lib/slug";

const NAME_MAX_LENGTH = 200;

export type ParsedOrganizationForm =
  | { ok: true; value: { name: string; slug: string } }
  | { ok: false; message: string };

export type CreateOrganizationResult =
  | { kind: "created"; organizationId: string }
  | { kind: "error"; message: string };

function text(form: { get(key: string): unknown }, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Fast feedback only; apothem-api validates again and its answer wins. */
export function parseOrganizationForm(form: { get(key: string): unknown }): ParsedOrganizationForm {
  const name = text(form, "name");
  if (!name) return { ok: false, message: "Enter a name." };
  if (name.length > NAME_MAX_LENGTH) return { ok: false, message: `Use at most ${NAME_MAX_LENGTH} characters.` };

  const explicit = text(form, "slug");
  const slug = explicit || slugify(name);
  if (!slug) return { ok: false, message: "Use letters or numbers in the name or enter a slug." };
  if (!isValidSlug(slug)) {
    return { ok: false, message: "Use lowercase letters, numbers and single hyphens (up to 63 characters)." };
  }
  return { ok: true, value: { name, slug } };
}

const MESSAGES: Record<number, string> = {
  400: "Some fields are invalid. Review the form and try again.",
  401: "You need to sign in again.",
  409: "That name is already taken. Try a different name or slug.",
};

export async function createOrganizationCommand(
  client: ApothemApiClient,
  input: { name: string; slug: string },
): Promise<CreateOrganizationResult> {
  try {
    const { data, response } = await createOrganization(client, input);
    if (response.status < 300 && data?.id && isUuid(data.id)) {
      return { kind: "created", organizationId: data.id };
    }
    return { kind: "error", message: MESSAGES[response.status] ?? "Something went wrong. Try again shortly." };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "error", message: "apothem-api is unreachable. Try again shortly." };
    throw error;
  }
}
