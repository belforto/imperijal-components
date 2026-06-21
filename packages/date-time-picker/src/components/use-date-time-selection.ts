import { isSameDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
	combineLocalDateTime,
	parseLocalInputValue,
} from '../lib/local-input-value';
import { timeSlotKey } from '../lib/time-slots';

export type DateTimeDraft = {
	date: Date | null;
	hours: number | null;
	minutes: number | null;
};

export function draftFromLocalValue(value: string): DateTimeDraft {
	const parsed = parseLocalInputValue(value);
	if (!parsed) return { date: null, hours: null, minutes: null };
	return {
		date: startOfDay(parsed),
		hours: parsed.getHours(),
		minutes: parsed.getMinutes(),
	};
}

export function draftToLocalValue(draft: DateTimeDraft): string | null {
	if (draft.date == null || draft.hours == null || draft.minutes == null) {
		return null;
	}
	return combineLocalDateTime(draft.date, draft.hours, draft.minutes);
}

export function isDraftComplete(draft: DateTimeDraft): boolean {
	return draft.date != null && draft.hours != null && draft.minutes != null;
}

type UseDateTimeSelectionOptions = {
	value: string;
	open: boolean;
};

export function useDateTimeSelection({
	value,
	open,
}: UseDateTimeSelectionOptions) {
	const committed = useMemo(() => draftFromLocalValue(value), [value]);
	const [draft, setDraft] = useState<DateTimeDraft>(committed);

	useEffect(() => {
		if (open) setDraft(committed);
	}, [open, committed]);

	const selectDate = useCallback((date: Date) => {
		setDraft((prev) => ({ ...prev, date: startOfDay(date) }));
	}, []);

	const selectTime = useCallback((hours: number, minutes: number) => {
		setDraft((prev) => ({ ...prev, hours, minutes }));
	}, []);

	const selectedTimeKey =
		draft.hours != null && draft.minutes != null
			? timeSlotKey(draft.hours, draft.minutes)
			: null;

	const isDateSelected = draft.date != null;

	const matchesQuickDate = useCallback(
		(date: Date) => draft.date != null && isSameDay(draft.date, date),
		[draft.date],
	);

	return {
		draft,
		selectDate,
		selectTime,
		selectedTimeKey,
		isDateSelected,
		isDraftComplete: isDraftComplete(draft),
		draftValue: draftToLocalValue(draft),
		matchesQuickDate,
	};
}
