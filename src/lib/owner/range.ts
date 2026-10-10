const JAKARTA = 'Asia/Jakarta';
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const LENGTHS = { today: 1, '7d': 7, '30d': 30, '90d': 90 } as const;

export type RangePreset = keyof typeof LENGTHS | 'custom';
export type DayRange = { from: string; to: string };

const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: JAKARTA, year: 'numeric', month: '2-digit', day: '2-digit' });

/** Calendar day in Asia/Jakarta. Storage stays UTC; only this boundary is local. */
export function jakartaDay(now: Date): string {
    return formatter.format(now);
}

export function isDay(value: unknown): value is string {
    return typeof value === 'string' && ISO_DAY.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function addDays(day: string, amount: number): string {
    const date = new Date(`${day}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + amount);
    return date.toISOString().slice(0, 10);
}

export function resolveRange(preset: RangePreset, from: unknown, to: unknown, now: Date): DayRange {
    const today = jakartaDay(now);
    if (preset === 'custom') {
        if (!isDay(from) || !isDay(to)) return { from: today, to: today };
        const start = from <= to ? from : to;
        const end = from <= to ? to : from;
        // Custom ranges are capped so a mistyped year cannot scan the whole table.
        return addDays(start, 366) < end ? { from: addDays(end, -366), to: end } : { from: start, to: end };
    }
    const length = LENGTHS[preset] ?? 1;
    return { from: addDays(today, -(length - 1)), to: today };
}

/** Inclusive day list so charts show real gaps instead of collapsing them. */
export function seriesDays(range: DayRange): string[] {
    const days: string[] = [];
    for (let day = range.from; day <= range.to && days.length <= 367; day = addDays(day, 1)) days.push(day);
    return days;
}
