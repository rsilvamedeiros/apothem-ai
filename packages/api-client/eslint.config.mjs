import { nextEslintConfig } from "@apothem/frontend-config/eslint/next";

const config = [{ ignores: ["src/generated/**"] }, ...nextEslintConfig(import.meta.dirname)];

export default config;
