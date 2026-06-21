'use client';

import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Calendar } from '../ui/calendar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '../ui/collapsible';
import { cn } from '../lib/utils';

type DateCalendarPanelProps = {
	selected: Date | null;
	onSelect: (date: Date) => void;
};

export function DateCalendarPanel({ selected, onSelect }: DateCalendarPanelProps) {
	const [open, setOpen] = useState(false);
	const month = useMemo(() => selected ?? new Date(), [selected]);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger asChild>
				<button
					type="button"
					className="group flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:bg-accent"
				>
					<div className="flex items-center gap-3">
						<CalendarIcon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
						<span className="text-sm font-medium">View Calendar</span>
					</div>
					<ChevronDownIcon
						className={cn(
							'size-5 text-muted-foreground transition-transform duration-300',
							open && 'rotate-180',
						)}
					/>
				</button>
			</CollapsibleTrigger>
			<CollapsibleContent className="mt-4 overflow-hidden rounded-xl border border-border bg-background p-4 shadow-sm">
				<div className="mb-3 flex items-center justify-between px-1">
					<span className="text-sm font-semibold">
						{format(month, 'MMMM yyyy')}
					</span>
				</div>
				<Calendar
					mode="single"
					selected={selected ?? undefined}
					onSelect={(date) => {
						if (!date) return;
						onSelect(date);
						setOpen(false);
					}}
					defaultMonth={month}
					className="mx-auto p-0"
				/>
			</CollapsibleContent>
		</Collapsible>
	);
}
