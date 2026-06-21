import {
	addDays,
	format,
	isSaturday,
	isSunday,
	nextSaturday,
	nextSunday,
	startOfDay,
} from 'date-fns';

export type QuickDateOption = {
	id: string;
	label: string;
	sublabel: string;
	date: Date;
};

function upcomingSaturday(reference: Date): Date {
	return isSaturday(reference) ? startOfDay(reference) : nextSaturday(reference);
}

function upcomingSunday(reference: Date): Date {
	return isSunday(reference) ? startOfDay(reference) : nextSunday(reference);
}

/** Quick-pick chips: Today, Tomorrow, upcoming Sat/Sun. */
export function getQuickDateOptions(reference = new Date()): QuickDateOption[] {
	const today = startOfDay(reference);
	const tomorrow = addDays(today, 1);
	const saturday = upcomingSaturday(today);
	const sunday = upcomingSunday(today);

	return [
		{
			id: 'today',
			label: 'Today',
			sublabel: format(today, 'MMM d'),
			date: today,
		},
		{
			id: 'tomorrow',
			label: 'Tomorrow',
			sublabel: format(tomorrow, 'MMM d'),
			date: tomorrow,
		},
		{
			id: 'saturday',
			label: format(saturday, 'EEE'),
			sublabel: format(saturday, 'MMM d'),
			date: saturday,
		},
		{
			id: 'sunday',
			label: format(sunday, 'EEE'),
			sublabel: format(sunday, 'MMM d'),
			date: sunday,
		},
	];
}
