/**
 * Utilities for the `datetime-local` value format: `YYYY-MM-DDTHH:mm`
 * (local time, no seconds, no timezone suffix).
 */

/** Format a Date as a datetime-local string. */
export function toLocalInputValue(d: Date): string {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Parse a datetime-local string into a Date, or null if invalid. */
export function parseLocalInputValue(value: string): Date | null {
	if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

/** Combine a calendar date with hours/minutes into a datetime-local string. */
export function combineLocalDateTime(
	date: Date,
	hours: number,
	minutes: number,
): string {
	const d = new Date(date);
	d.setHours(hours, minutes, 0, 0);
	return toLocalInputValue(d);
}

/** Human-readable label for the trigger button. */
export function formatLocalInputDisplay(
	value: string,
	placeholder?: string,
): string {
	const d = parseLocalInputValue(value);
	if (!d) return placeholder ?? 'Select date & time';
	return d.toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
}
