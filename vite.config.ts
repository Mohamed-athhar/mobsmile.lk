import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// TanStack Start + Nitro. Nitro detects Vercel at build time and emits the
// output Vercel deploys, so no build command / output directory is needed
// in the Vercel dashboard. The custom server entry in src/server.ts is picked
// up automatically by TanStack Start.
export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
});
