// Generate a pseudo-random rating based on host id or alias
export function getRating(user: any) {
  if (!user) return 3.5;

  const str = user.id?.toString() || user.alias || user.name || 'default';

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  // Gör positivt
  const positiveHash = Math.abs(hash);

  // Skala till 2.5–5
  const raw = 2.5 + (positiveHash % 250) / 100;

  // Avrunda till 0.5 steg
  return Math.round(raw * 2) / 2;
}
