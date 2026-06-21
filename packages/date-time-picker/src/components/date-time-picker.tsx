'use client';

import { CalendarIcon, ClockIcon } from 'lucide-react';
import { useState } from 'react';

import {
	formatLocalInputDisplay,
} from '../lib/local-input-value';
import type { TimeSlotConfig } from '../lib/time-slots';
import { cn } from '../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
	DateTimePickerContent,
	type DateTimePickerContentProps,
} from './date-time-picker-content';

export type DateTimePickerProps = {
	/** datetime-local string: `YYYY-MM-DDTHH:mm` */
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	id?: string;
	size?: 'default' | 'sm';
	timeSlots?: TimeSlotConfig;
	align?: 'start' | 'center' | 'end';
};

export function DateTimePicker({
	value,
	onChange,
	placeholder = 'Select date & time',
	disabled = false,
	className,
	id,
	size = 'default',
	timeSlots,
	align = 'start',
}: DateTimePickerProps) {
	const [open, setOpen] = useState(false);

	const handleConfirm: DateTimePickerContentProps['onConfirm'] = (next) => {
		onChange(next);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					id={id}
					type="button"
					disabled={disabled}
					className={cn(
						'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background text-left shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
						size === 'sm'
							? 'px-2 py-1 text-[11px]'
							: 'px-2 py-1.5 text-xs',
						className,
					)}
				>
					<span className={cn('truncate', !value && 'text-muted-foreground')}>
						{formatLocalInputDisplay(value, placeholder)}
					</span>
					<CalendarIcon
						className={cn(
							'shrink-0 text-muted-foreground',
							size === 'sm' ? 'size-3.5' : 'size-4',
						)}
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent
				align={align}
				className="w-[min(calc(100vw-2rem),28rem)] p-4"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
					<ClockIcon className="size-5 text-primary" />
					<h3 className="text-sm font-semibold">Select Date &amp; Time</h3>
				</div>
				<DateTimePickerContent
					value={value}
					open={open}
					onConfirm={handleConfirm}
					timeSlots={timeSlots}
				/>
			</PopoverContent>
		</Popover>
	);
}
