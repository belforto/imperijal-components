'use client';

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { TimeSlot } from '../lib/time-slots';
import { timeSlotKey } from '../lib/time-slots';
import { cn } from '../lib/utils';

type TimeSlotGridProps = {
	slots: TimeSlot[];
	selectedKey: string | null;
	disabled?: boolean;
	onSelect: (hours: number, minutes: number) => void;
};

const SCROLL_STEP_PX = 128;

export function TimeSlotGrid({
	slots,
	selectedKey,
	disabled = false,
	onSelect,
}: TimeSlotGridProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollUp, setCanScrollUp] = useState(false);
	const [canScrollDown, setCanScrollDown] = useState(false);

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setCanScrollUp(el.scrollTop > 1);
		setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
	}, []);

	useEffect(() => {
		updateScrollState();
	}, [slots, updateScrollState]);

	useEffect(() => {
		if (!selectedKey || !scrollRef.current) return;
		const selected = scrollRef.current.querySelector(
			`[data-slot-key="${selectedKey}"]`,
		);
		selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		const timer = window.setTimeout(updateScrollState, 200);
		return () => window.clearTimeout(timer);
	}, [selectedKey, updateScrollState]);

	const scrollBy = (delta: number) => {
		scrollRef.current?.scrollBy({ top: delta, behavior: 'smooth' });
	};

	return (
		<div
			className={cn(
				'overflow-hidden rounded-xl border border-border bg-background transition-opacity duration-300',
				disabled && 'pointer-events-none opacity-40',
			)}
		>
			<button
				type="button"
				disabled={disabled || !canScrollUp}
				onClick={() => scrollBy(-SCROLL_STEP_PX)}
				aria-label="Show earlier times"
				className={cn(
					'flex w-full items-center justify-center border-b border-border py-1.5 transition-colors',
					canScrollUp && !disabled
						? 'text-primary hover:bg-accent active:scale-95'
						: 'cursor-default text-muted-foreground/30',
				)}
			>
				<ChevronUpIcon className="size-5" />
			</button>

			<div
				ref={scrollRef}
				onScroll={updateScrollState}
				className="max-h-52 overflow-y-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				<div className="grid grid-cols-3 gap-2">
					{slots.map((slot) => {
						const key = timeSlotKey(slot.hours, slot.minutes);
						const active = selectedKey === key;
						return (
							<button
								key={key}
								type="button"
								data-slot-key={key}
								disabled={disabled}
								onClick={() => onSelect(slot.hours, slot.minutes)}
								className={cn(
									'rounded-xl border py-3 text-sm font-medium transition-all active:scale-95',
									active
										? 'border-primary bg-primary text-primary-foreground shadow-md'
										: 'border-border bg-background hover:border-primary hover:bg-accent',
								)}
							>
								{slot.label}
							</button>
						);
					})}
				</div>
			</div>

			<button
				type="button"
				disabled={disabled || !canScrollDown}
				onClick={() => scrollBy(SCROLL_STEP_PX)}
				aria-label="Show later times"
				className={cn(
					'flex w-full items-center justify-center border-t border-border py-1.5 transition-colors',
					canScrollDown && !disabled
						? 'text-primary hover:bg-accent active:scale-95'
						: 'cursor-default text-muted-foreground/30',
				)}
			>
				<ChevronDownIcon className="size-5" />
			</button>
		</div>
	);
}
