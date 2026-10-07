/**
 * Client-side mirror of the API's create-agent rules, for fast feedback only.
 * apothem-api stays authoritative: it validates again and its answer wins.
 */
export const AGENT_LIMITS = { name: 200, slug: 63, description: 2000 } as const;

export const INSTRUCTIONS_MAX_LENGTH = 50_000;

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type CreateAgentInput = { name: string; slug: string; description?: string };
export type CreateAgentFieldErrors = Partial<Record<"name" | "slug" | "description", string>>;
export type ParsedCreateAgentForm =
  | { ok: true; value: CreateAgentInput }
  | { ok: false; errors: CreateAgentFieldErrors };

type FormLike = { get(key: string): unknown };

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, AGENT_LIMITS.slug)
    .replace(/-+$/g, "");
}

function text(form: FormLike, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseCreateAgentForm(form: FormLike): ParsedCreateAgentForm {
  const name = text(form, "name");
  const slug = text(form, "slug") || slugify(name);
  const description = text(form, "description");
  const errors: CreateAgentFieldErrors = {};

  if (name.length === 0) errors.name = "Enter a name.";
  else if (name.length > AGENT_LIMITS.name) {
    errors.name = `Use at most ${AGENT_LIMITS.name} characters.`;
  }

  if (slug.length === 0) errors.slug = "Enter a slug.";
  else if (slug.length > AGENT_LIMITS.slug || !SLUG.test(slug)) {
    errors.slug = "Use lowercase letters, numbers and single hyphens (up to 63 characters).";
  }

  if (description.length > AGENT_LIMITS.description) {
    errors.description = `Use at most ${AGENT_LIMITS.description} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, slug, ...(description ? { description } : {}) } };
}
