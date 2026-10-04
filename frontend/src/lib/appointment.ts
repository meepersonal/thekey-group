export const OPENING_HOURS_START = "09:00";
export const OPENING_HOURS_END = "19:00";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function toMinutes(time: string): number | null {
  const match = TIME_PATTERN.exec(time.trim());
  if (!match) {
    return null;
  }
  return Number(match[1]) * 60 + Number(match[2]);
}

export function isWithinOpeningHours(time: string): boolean {
  const minutes = toMinutes(time);
  if (minutes === null) {
    return false;
  }
  return minutes >= toMinutes(OPENING_HOURS_START)! && minutes <= toMinutes(OPENING_HOURS_END)!;
}

export function openingHoursError(time: string): string | null {
  if (!time) {
    return "Choisissez une heure de rendez-vous.";
  }
  if (!isWithinOpeningHours(time)) {
    return `Nos agences sont ouvertes de ${OPENING_HOURS_START} à ${OPENING_HOURS_END}.`;
  }
  return null;
}
