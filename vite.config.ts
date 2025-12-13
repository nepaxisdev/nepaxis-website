import * as path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default {
	root: path.resolve(__dirname, "src"),
	publicDir: "../public",
	base: "./",
	plugins: [
		ViteImageOptimizer({
			webp: {
				quality: 70,
			},
		}),
	],
	// resolve: {
	// 	alias: {
	// 		"~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
	// 	},
	// },
	server: {
		watch: {
			usePolling: true,
		},
		port: 5174,
	},
	build: {
		outDir: path.join(__dirname, "dist"),
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, "src/index.html"),
			},
		},
	},
};
