/** Public widgets older than this are hidden instead of shown as current. */
export const ETF_MAX_AGE_DAYS = 10;
export const MICA_MAX_AGE_DAYS = 30;

export function ageInDays(iso: string | null | undefined, now = new Date()): number | null {
  if (!iso?.trim()) return null;
  const parsed = new Date(iso.includes('T') ? iso : `${iso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return (now.getTime() - parsed.getTime()) / (24 * 60 * 60 * 1000);
}

export function isFreshEnough(iso: string | null | undefined, maxAgeDays: number, now = new Date()): boolean {
  const age = ageInDays(iso, now);
  return age != null && age >= 0 && age <= maxAgeDays;
}