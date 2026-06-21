import { useState } from 'react';

import {
	DateTimePicker,
	toLocalInputValue,
} from '@imperijal/date-time-picker';

export function DateTimePickerDemo() {
	const [defaultSize, setDefaultSize] = useState(() =>
		toLocalInputValue(new Date(Date.now() + 4 * 60 * 60 * 1000)),
	);
	const [smallSize, setSmallSize] = useState(() => toLocalInputValue(new Date()));
	const [earlyHours, setEarlyHours] = useState('');

	return (
		<div className="space-y-8">
			<header>
				<h2 className="text-xl font-bold">DateTimePicker</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Output format:{' '}
					<code className="rounded-md border border-white/50 bg-white/60 px-1.5 py-0.5 text-xs shadow-sm backdrop-blur-sm">
						YYYY-MM-DDTHH:mm
					</code>
				</p>
			</header>

			<section className="grid gap-6 lg:grid-cols-2">
				<div className="rounded-xl border border-white/50 bg-white/70 p-5 shadow-lg shadow-primary/5 backdrop-blur-md">
					<h3 className="mb-1 text-sm font-semibold">Default size</h3>
					<p className="mb-4 text-xs text-muted-foreground">
						Default deadline-style usage
					</p>
					<DateTimePicker value={defaultSize} onChange={setDefaultSize} />
					<p className="mt-3 font-mono text-xs text-primary">{defaultSize || '—'}</p>
				</div>

				<div className="rounded-xl border border-white/50 bg-white/70 p-5 shadow-lg shadow-primary/5 backdrop-blur-md">
					<h3 className="mb-1 text-sm font-semibold">Small size</h3>
					<p className="mb-4 text-xs text-muted-foreground">
						Matches delivery list rows in restoranico
					</p>
					<DateTimePicker
						value={smallSize}
						onChange={setSmallSize}
						size="sm"
					/>
					<p className="mt-3 font-mono text-xs text-primary">{smallSize || '—'}</p>
				</div>

				<div className="rounded-xl border border-white/50 bg-white/70 p-5 shadow-lg shadow-primary/5 backdrop-blur-md lg:col-span-2">
					<h3 className="mb-1 text-sm font-semibold">Custom time range</h3>
					<p className="mb-4 text-xs text-muted-foreground">
						06:00–22:00, 15-minute slots
					</p>
					<div className="max-w-sm">
						<DateTimePicker
							value={earlyHours}
							onChange={setEarlyHours}
							popoverClassName="shadow-2xl"
							timeSlots={{
								startHour: 6,
								endHour: 22,
								intervalMinutes: 15,
							}}
						/>
					</div>
					<p className="mt-3 font-mono text-xs text-primary">
						{earlyHours || '—'}
					</p>
				</div>
			</section>
		</div>
	);
}
