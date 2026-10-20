import { Medication } from './settings';

/** Turns "9:30", "9:30 am" or "7:30 pm" into minutes since midnight. Returns null if it can't read it. */
export function parseTime(t: string): number | null {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const ap = m[3] ? m[3].toLowerCase() : '';
  if (h > 23 || min > 59) return null;
  if (ap) {
    if (h < 1 || h > 12) return null;
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
  } else if (h >= 1 && h <= 5) {
    h += 12; // no am/pm given: 1-5 is read as afternoon, 6-11 as morning
  }
  return h * 60 + min;
}

export function formatTime(min: number): string {
  const h24 = Math.floor(min / 60);
  const m = min % 60;
  const ap = h24 >= 12 ? 'pm' : 'am';
  const h = h24 % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

/** Shows a stored time in a friendly way ("9:30" becomes "9:30 am"). */
export function displayTime(t: string): string {
  const p = parseTime(t);
  return p === null ? t || 'Anytime' : formatTime(p);
}

export type MedGroup = { key: string; title: string; due: string; meds: Medication[] };

/** Groups medications into Morning / Afternoon / Evening by their time. */
export function groupMeds(meds: Medication[]): MedGroup[] {
  const buckets: Record<string, Medication[]> = { Morning: [], Afternoon: [], Evening: [], Other: [] };
  meds.forEach((m) => {
    const t = parseTime(m.time);
    const key = t === null ? 'Other' : t < 12 * 60 ? 'Morning' : t < 17 * 60 ? 'Afternoon' : 'Evening';
    buckets[key].push(m);
  });
  return ['Morning', 'Afternoon', 'Evening', 'Other']
    .filter((k) => buckets[k].length > 0)
    .map((k) => {
      const sorted = [...buckets[k]].sort((a, b) => (parseTime(a.time) ?? 0) - (parseTime(b.time) ?? 0));
      const first = parseTime(sorted[0].time);
      return {
        key: k,
        title: k === 'Other' ? 'Other medication' : `${k} medication`,
        due: first === null ? 'Anytime' : `Due ${formatTime(first)}`,
        meds: sorted,
      };
    });
}
