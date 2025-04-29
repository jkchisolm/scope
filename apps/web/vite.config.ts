import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterDevTools } from "react-router-devtools";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // define: {
    //   "import.meta.env.VITE_SERVER_URL": process.env.VITE_SERVER_URL,
    //   "import.meta.env.VITE_GOOGLE_CLIENT_ID":
    //     process.env.VITE_GOOGLE_CLIENT_ID,
    // },
    plugins: [
      tailwindcss(),
      reactRouterDevTools(),
      reactRouter(),
      tsconfigPaths(),
    ],
  };
});
