import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		devtools(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		viteReact(),
		tailwindcss(),
	],
	optimizeDeps: {
		exclude: ["@wpt/backend"],
	},
	server: {
		port: 3000,
		proxy: {
			// Setup the proxy for the backend
			"/api/": {
				target: "http://localhost:8000",
				changeOrigin: true,
			},
		},
		fs: {
			// Allow searching for files in the entire 'packages' directory
			// or simply use '..' to allow the immediate parent
			allow: [".."],
		},
		watch: {
			// Watch backend changes so frontend auto-reloads
			ignored: ["!**/packages/backend/**"],
		},
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
