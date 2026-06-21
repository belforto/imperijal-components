'use client';

import * as React from 'react';
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from 'lucide-react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '../lib/utils';
import { Button, buttonVariants } from './button';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = 'label',
	buttonVariant = 'ghost',
	formatters,
	components,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				'bg-background group/calendar p-3 [--cell-size:2.5rem]',
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString('default', { month: 'short' }),
				...formatters,
			}}
			classNames={{
				root: cn('w-fit', defaultClassNames.root),
				months: cn(
					'flex gap-4 flex-col md:flex-row relative',
					defaultClassNames.months,
				),
				month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
				nav: cn(
					'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
					defaultClassNames.button_next,
				),
				month_caption: cn(
					'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
					defaultClassNames.month_caption,
				),
				caption_label: cn(
					'select-none font-medium text-sm',
					defaultClassNames.caption_label,
				),
				table: 'w-full border-collapse',
				weekdays: cn('flex', defaultClassNames.weekdays),
				weekday: cn(
					'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
					defaultClassNames.weekday,
				),
				week: cn('flex w-full mt-2', defaultClassNames.week),
				day: cn(
					'relative w-full h-full p-0 text-center group/day aspect-square select-none',
					defaultClassNames.day,
				),
				outside: cn(
					'text-muted-foreground aria-selected:text-muted-foreground',
					defaultClassNames.outside,
				),
				disabled: cn(
					'text-muted-foreground opacity-50',
					defaultClassNames.disabled,
				),
				hidden: cn('invisible', defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Chevron: ({ className, orientation, ...chevronProps }) => {
					if (orientation === 'left') {
						return (
							<ChevronLeftIcon
								className={cn('size-4', className)}
								{...chevronProps}
							/>
						);
					}
					if (orientation === 'right') {
						return (
							<ChevronRightIcon
								className={cn('size-4', className)}
								{...chevronProps}
							/>
						);
					}
					return (
						<ChevronDownIcon
							className={cn('size-4', className)}
							{...chevronProps}
						/>
					);
				},
				DayButton: CalendarDayButton,
				...components,
			}}
			{...props}
		/>
	);
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	...props
}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();
	const ref = React.useRef<HTMLButtonElement>(null);

	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			className={cn(
				'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground flex aspect-square size-auto w-full min-w-(--cell-size) font-normal',
				defaultClassNames.day,
				className,
			)}
			{...props}
		/>
	);
}

export { Calendar };
