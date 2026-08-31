import { FlatCompat } from "@eslint/eslintrc";

/**
 * `baseDirectory` must be the consuming app's own directory (pass
 * `import.meta.dirname` from its eslint.config.mjs) — FlatCompat resolves
 * `next/core-web-vitals`/`next/typescript` relative to it, and each app's
 * `eslint-config-next`/`next` install is what actually gets resolved.
 */
export function nextEslintConfig(baseDirectory) {
  const compat = new FlatCompat({ baseDirectory });
  return [
    { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
  ];
}
