import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import { preview } from "vite";
import { loadEnv } from "vite";

// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  };
  return defineConfig({
    plugins: [
      TanStackRouterVite({ autoCodeSplitting: true }),
      viteReact(),
      tailwindcss(),
    ],
    test: {
      globals: true,
      environment: "jsdom",
    },
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    preview: {
      allowedHosts: ["scope.jkchisolm.com"],
    },
  });
};
