import { useState } from 'react';

import { DateTimePickerDemo } from './demos/DateTimePickerDemo';

type DemoId = 'date-time-picker';

const DEMOS: { id: DemoId; label: string; package: string }[] = [
	{
		id: 'date-time-picker',
		label: 'Date & Time Picker',
		package: '@imperijal/date-time-picker',
	},
];

export default function App() {
	const [active, setActive] = useState<DemoId>('date-time-picker');
	const current = DEMOS.find((d) => d.id === active)!;

	return (
		<div className="flex min-h-screen">
			<aside className="w-64 shrink-0 border-r border-white/40 bg-white/55 p-4 shadow-sm backdrop-blur-xl">
				<div className="mb-6">
					<p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
						Imperijal
					</p>
					<h1 className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-lg font-bold text-transparent">
						Components
					</h1>
					<p className="text-xs text-muted-foreground">Local demo playground</p>
				</div>

				<nav className="space-y-1">
					{DEMOS.map((demo) => (
						<button
							key={demo.id}
							type="button"
							onClick={() => setActive(demo.id)}
							className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
								active === demo.id
									? 'bg-primary text-primary-foreground'
									: 'hover:bg-accent'
							}`}
						>
							{demo.label}
						</button>
					))}
				</nav>

				<p className="mt-8 text-[10px] leading-relaxed text-muted-foreground">
					Add new packages under{' '}
					<code className="text-foreground">packages/</code> and register them
					here.
				</p>
			</aside>

			<main className="flex-1 p-8">
				<p className="mb-6 text-xs text-muted-foreground">
					Package:{' '}
					<code className="rounded-md border border-white/50 bg-white/60 px-1.5 py-0.5 shadow-sm backdrop-blur-sm">
						{current.package}
					</code>
				</p>
				{active === 'date-time-picker' ? <DateTimePickerDemo /> : null}
			</main>
		</div>
	);
}
