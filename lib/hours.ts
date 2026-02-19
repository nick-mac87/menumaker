// Maps day names/ranges to day numbers (0=Sun, 1=Mon, ..., 6=Sat)
const DAY_MAP: Record<string, number> = {
  'sun': 0, 'sunday': 0,
  'mon': 1, 'monday': 1,
  'tue': 2, 'tuesday': 2, 'tues': 2,
  'wed': 3, 'wednesday': 3,
  'thu': 4, 'thursday': 4, 'thur': 4, 'thurs': 4,
  'fri': 5, 'friday': 5,
  'sat': 6, 'saturday': 6,
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface TimeRange {
  open: number; // minutes from midnight
  close: number; // minutes from midnight
}

interface DaySchedule {
  day: number;
  dayName: string;
  ranges: TimeRange[];
  closed: boolean;
}

function parseTime(str: string): number {
  const cleaned = str.trim().replace(/[^\d:]/g, '');
  const parts = cleaned.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1] || '0', 10);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function expandDayRange(rangeStr: string): number[] {
  const cleaned = rangeStr.toLowerCase().replace(/[–—]/g, '-').trim();

  // Check for a range like "mon-sat" or "mon - fri"
  const rangeParts = cleaned.split('-').map((s) => s.trim());

  if (rangeParts.length === 2) {
    const start = DAY_MAP[rangeParts[0]];
    const end = DAY_MAP[rangeParts[1]];

    if (start !== undefined && end !== undefined) {
      const days: number[] = [];
      let current = start;
      while (current !== end) {
        days.push(current);
        current = (current + 1) % 7;
      }
      days.push(end);
      return days;
    }
  }

  // Check for comma-separated days
  const commaParts = cleaned.split(',').map((s) => s.trim());
  if (commaParts.length > 1) {
    const days: number[] = [];
    for (const part of commaParts) {
      const d = DAY_MAP[part];
      if (d !== undefined) days.push(d);
    }
    return days;
  }

  // Single day
  const single = DAY_MAP[cleaned];
  if (single !== undefined) return [single];

  return [];
}

export function parseHours(hours: Record<string, string>): DaySchedule[] {
  const schedules: Map<number, DaySchedule> = new Map();

  // Initialize all days as closed
  for (let i = 0; i < 7; i++) {
    schedules.set(i, { day: i, dayName: DAY_NAMES[i], ranges: [], closed: true });
  }

  for (const [dayRange, timeStr] of Object.entries(hours)) {
    const days = expandDayRange(dayRange);
    const timeCleaned = timeStr.replace(/[–—]/g, '-').trim().toLowerCase();

    if (timeCleaned === 'closed' || timeCleaned === '') {
      continue;
    }

    // Parse time range like "11:00 - 22:00"
    const timeParts = timeCleaned.split('-').map((s) => s.trim());
    if (timeParts.length === 2) {
      const open = parseTime(timeParts[0]);
      const close = parseTime(timeParts[1]);
      for (const day of days) {
        const schedule = schedules.get(day)!;
        schedule.ranges.push({ open, close });
        schedule.closed = false;
      }
    }
  }

  return Array.from(schedules.values()).sort((a, b) => a.day - b.day);
}

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  nextChange: string; // e.g., "Closes at 22:00" or "Opens Mon at 11:00"
}

export function getOpenStatus(hours?: Record<string, string>): OpenStatus | null {
  if (!hours || Object.keys(hours).length === 0) return null;

  const schedules = parseHours(hours);
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = schedules.find((s) => s.day === currentDay);

  // Check if currently open
  if (todaySchedule && !todaySchedule.closed) {
    for (const range of todaySchedule.ranges) {
      if (currentMinutes >= range.open && currentMinutes < range.close) {
        return {
          isOpen: true,
          label: 'Open now',
          nextChange: `Closes at ${formatTime(range.close)}`,
        };
      }
    }
  }

  // Currently closed — find next opening
  for (let offset = 0; offset < 7; offset++) {
    const checkDay = (currentDay + offset) % 7;
    const schedule = schedules.find((s) => s.day === checkDay);

    if (schedule && !schedule.closed) {
      for (const range of schedule.ranges) {
        // If same day, only consider future ranges
        if (offset === 0 && range.open <= currentMinutes) continue;

        const dayLabel = offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : DAY_NAMES_SHORT[checkDay];
        const timeLabel = formatTime(range.open);

        return {
          isOpen: false,
          label: 'Closed',
          nextChange: offset === 0
            ? `Opens at ${timeLabel}`
            : `Opens ${dayLabel} at ${timeLabel}`,
        };
      }
    }
  }

  return {
    isOpen: false,
    label: 'Closed',
    nextChange: '',
  };
}

export function getFormattedHours(hours?: Record<string, string>): { day: string; time: string; isToday: boolean }[] {
  if (!hours) return [];

  const schedules = parseHours(hours);
  const currentDay = new Date().getDay();

  // Group consecutive days with same hours
  const groups: { days: number[]; time: string }[] = [];

  for (const schedule of schedules) {
    if (schedule.closed) {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.time === 'Closed') {
        lastGroup.days.push(schedule.day);
      } else {
        groups.push({ days: [schedule.day], time: 'Closed' });
      }
    } else {
      const timeStr = schedule.ranges.map((r) => `${formatTime(r.open)} – ${formatTime(r.close)}`).join(', ');
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.time === timeStr) {
        lastGroup.days.push(schedule.day);
      } else {
        groups.push({ days: [schedule.day], time: timeStr });
      }
    }
  }

  return groups.map((group) => {
    const isToday = group.days.includes(currentDay);
    let dayLabel: string;

    if (group.days.length === 1) {
      dayLabel = DAY_NAMES_SHORT[group.days[0]];
    } else if (group.days.length === 7) {
      dayLabel = 'Every day';
    } else {
      // Check if consecutive
      const isConsecutive = group.days.every((d, i) =>
        i === 0 || (d - group.days[i - 1] + 7) % 7 === 1
      );
      if (isConsecutive && group.days.length > 2) {
        dayLabel = `${DAY_NAMES_SHORT[group.days[0]]} – ${DAY_NAMES_SHORT[group.days[group.days.length - 1]]}`;
      } else {
        dayLabel = group.days.map((d) => DAY_NAMES_SHORT[d]).join(', ');
      }
    }

    return { day: dayLabel, time: group.time, isToday };
  });
}
