export function generateSlug(username: string): string {
  const slug = username.toLowerCase().replace(/\s+/g, '-');
  return slug;
}

export function generateFiveDigitNumber(): number {
  return Math.floor(Math.random() * 90000) + 10000;
}

export const adjustDate = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeekBounds = (date: Date): { monday: Date; friday: Date } => {
  const dayOfWeek = date.getDay();
  const dayOffset = dayOfWeek === 0 ? -6 : 1; // If it's Sunday (0), set to -6 to get last Monday
  const mondayOffset = dayOffset - dayOfWeek; // Calculate offset for Monday
  const fridayOffset = 5 - dayOfWeek; // Calculate offset for Friday

  const monday = adjustDate(date, mondayOffset);
  const friday = adjustDate(date, fridayOffset);

  // Adjust the Friday date to include the entire day
  friday.setHours(23, 59, 59, 999);

  return { monday, friday };
};
