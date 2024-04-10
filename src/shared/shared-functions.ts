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

export const getDayAfterTomorrow = (date: Date): string => {
  const resultDate = new Date(date.getTime());
  resultDate.setDate(resultDate.getDate() + 2);
  return resultDate.toISOString();
};
