import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const exclude = ["**/node_modules/**", "**/.next*/**", "**/dist/**", "e2e/**"];

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["**/*.test.ts"],
          exclude,
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: ["**/*.test.tsx"],
          exclude,
          setupFiles: ["./vitest.setup.dom.ts"],
        },
      },
    ],
  },
});
