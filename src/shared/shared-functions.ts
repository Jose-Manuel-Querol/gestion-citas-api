export function generateSlug(username: string): string {
  const slug = username.toLowerCase().replace(/\s+/g, '-');
  return slug;
}

export function generateFiveDigitNumber(): number {
  return Math.floor(Math.random() * 90000) + 10000;
}
