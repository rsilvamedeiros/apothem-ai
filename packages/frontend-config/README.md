# @apothem/frontend-config

Shared TypeScript and ESLint config for `apps/site` and `apps/web`, so both stop hand-duplicating the same compiler options and Next.js lint setup.

- `@apothem/frontend-config/tsconfig/next-app.json` — base `compilerOptions` for a Next.js App Router app. Each app's own `tsconfig.json` extends it and adds `paths`/`include`/`exclude`.
- `@apothem/frontend-config/eslint/next` — exports `nextEslintConfig(baseDirectory)`; each app's `eslint.config.mjs` calls it with `import.meta.dirname`.
