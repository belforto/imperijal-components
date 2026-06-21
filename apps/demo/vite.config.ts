import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));
const pickerSrc = path.resolve(
	root,
	'../../packages/date-time-picker/src/index.ts',
);

export default defineConfig({
	plugins: [react(), tailwindcss()],
	// GitHub Pages: set IMPERIJAL_DEMO_BASE=/imperijal-components/ when deploying
	base: process.env.IMPERIJAL_DEMO_BASE ?? '/',
	resolve: {
		alias: {
			// Live source — edit packages/date-time-picker and see changes instantly
			'@imperijal/date-time-picker': pickerSrc,
		},
	},
	server: {
		port: 5173,
		open: true,
		watch: {
			// Reduce watchers (helps ENOSPC on Linux with low fs.inotify.max_user_watches)
			ignored: [
				'**/node_modules/**',
				'**/.git/**',
				'**/dist/**',
				'**/.pnpm/**',
			],
			// Set CHOKIDAR_USEPOLLING=true if you still hit ENOSPC (no sudo needed)
			usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
		},
	},
});
