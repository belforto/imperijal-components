'use client';

import { format } from 'date-fns';
import { ArrowRightIcon } from 'lucide-react';
import { useMemo } from 'react';

import { getQuickDateOptions } from '../lib/quick-dates';
import {
	generateTimeSlots,
	type TimeSlotConfig,
} from '../lib/time-slots';
import { Button } from '../ui/button';
import { DateCalendarPanel } from './date-calendar-panel';
import { DateQuickChips } from './date-quick-chips';
import { TimeSlotGrid } from './time-slot-grid';
import { useDateTimeSelection } from './use-date-time-selection';

export type DateTimePickerContentProps = {
	value: string;
	open: boolean;
	onConfirm: (value: string) => void;
	timeSlots?: TimeSlotConfig;
};

export function DateTimePickerContent({
	value,
	open,
	onConfirm,
	timeSlots,
}: DateTimePickerContentProps) {
	const quickDates = useMemo(() => getQuickDateOptions(), []);
	const slots = useMemo(() => generateTimeSlots(timeSlots), [timeSlots]);

	const {
		draft,
		selectDate,
		selectTime,
		selectedTimeKey,
		isDateSelected,
		isDraftComplete,
		draftValue,
		matchesQuickDate,
	} = useDateTimeSelection({ value, open });

	const selectedDateLabel = draft.date
		? format(draft.date, 'EEE, MMM d')
		: null;
	const selectedTimeLabel =
		draft.hours != null && draft.minutes != null
			? `${String(draft.hours).padStart(2, '0')}:${String(draft.minutes).padStart(2, '0')}`
			: null;

	return (
		<div className="flex max-h-[min(80vh,640px)] flex-col">
			<div className="flex-1 space-y-6 overflow-y-auto p-1 pr-2">
				<section>
					<div className="mb-4 flex items-center justify-between">
						<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
							Step 1: Choose Date
						</span>
						{selectedDateLabel ? (
							<span className="text-sm font-medium text-primary">
								{selectedDateLabel}
							</span>
						) : null}
					</div>

					<DateQuickChips
						options={quickDates}
						isSelected={matchesQuickDate}
						onSelect={selectDate}
					/>

					<div className="mt-4">
						<DateCalendarPanel selected={draft.date} onSelect={selectDate} />
					</div>
				</section>

				<section
					className={
						isDateSelected
							? 'opacity-100 transition-opacity duration-300'
							: 'pointer-events-none opacity-40 transition-opacity duration-300'
					}
				>
					<div className="mb-4 flex items-center justify-between">
						<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
							Step 2: Choose Time
						</span>
						{selectedTimeLabel ? (
							<span className="text-sm font-medium text-primary">
								{selectedTimeLabel}
							</span>
						) : null}
					</div>

					<TimeSlotGrid
						slots={slots}
						selectedKey={selectedTimeKey}
						disabled={!isDateSelected}
						onSelect={selectTime}
					/>
				</section>
			</div>

			<div className="mt-4 border-t border-border/60 pt-4">
				<Button
					type="button"
					className="h-11 w-full rounded-xl text-sm font-semibold shadow-lg"
					disabled={!isDraftComplete || !draftValue}
					onClick={() => {
						if (draftValue) onConfirm(draftValue);
					}}
				>
					Confirm Selection
					<ArrowRightIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}
