import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = env["VITE_SITE_URL"] ?? "";

  if (mode === "production" && /localhost|127\.0\.0\.1/.test(siteUrl)) {
    console.warn(
      `\n[seo] VITE_SITE_URL vaut « ${siteUrl} » : les balises canonical, og:url et les liens\n` +
        `     du back-office seront figés sur cette adresse dans le build de production.\n` +
        `     Définissez VITE_SITE_URL sur le domaine public avant de builder.\n`,
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      host: "0.0.0.0",
      port: 8081,
      proxy: {
        "/public-data": {
          target: "https://api-key-group.geant.app",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/public-data/, ""),
        },
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
