export type TimeSlot = {
	hours: number;
	minutes: number;
	label: string;
};

export type TimeSlotConfig = {
	startHour?: number;
	endHour?: number;
	intervalMinutes?: number;
};

const DEFAULT_CONFIG: Required<TimeSlotConfig> = {
	startHour: 5,
	endHour: 24,
	intervalMinutes: 30,
};

/** Generate half-hour (or custom) time slots for the picker grid. */
export function generateTimeSlots(config: TimeSlotConfig = {}): TimeSlot[] {
	const { startHour, endHour, intervalMinutes } = {
		...DEFAULT_CONFIG,
		...config,
	};

	const slots: TimeSlot[] = [];
	let totalMinutes = startHour * 60;
	const endMinutes = endHour * 60;

	while (totalMinutes < endMinutes) {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		slots.push({
			hours,
			minutes,
			label: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
		});
		totalMinutes += intervalMinutes;
	}

	return slots;
}

export function timeSlotKey(hours: number, minutes: number): string {
	return `${hours}:${minutes}`;
}
