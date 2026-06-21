import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	external: [
		'react',
		'react-dom',
		'date-fns',
		'lucide-react',
		'react-day-picker',
		'@radix-ui/react-popover',
		'@radix-ui/react-collapsible',
		'@radix-ui/react-slot',
		'class-variance-authority',
		'clsx',
		'tailwind-merge',
	],
});
