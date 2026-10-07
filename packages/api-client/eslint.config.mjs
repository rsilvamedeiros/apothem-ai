import { nextEslintConfig } from "@apothem/frontend-config/eslint/next";

// These packages are not Next apps (no pages directory), so the rule only produces noise.
const noPagesRule = { rules: { "@next/next/no-html-link-for-pages": "off" } };

const config = [{ ignores: ["src/generated/**"] }, ...nextEslintConfig(import.meta.dirname), noPagesRule];

export default config;
