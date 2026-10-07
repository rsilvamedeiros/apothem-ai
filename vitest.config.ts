import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: { "@": path.resolve(__dirname, "apps/web/src") },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tooling/vitest.setup.ts"],
    include: ["apps/**/*.test.{ts,tsx}", "packages/**/*.test.{ts,tsx}", "tooling/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "e2e/**"],
    css: { modules: { classNameStrategy: "non-scoped" } },
    coverage: {
      provider: "v8",
      include: ["apps/web/src/**/*.{ts,tsx}", "packages/*/src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        "**/generated/**",
        "apps/*/src/app/**",
      ],
      reporter: ["text-summary", "json-summary", "lcov"],
      // Floors are a ratchet: raise them as coverage grows, never lower them.
      thresholds: { lines: 75, functions: 74, branches: 82, statements: 75 },
    },
  },
});
