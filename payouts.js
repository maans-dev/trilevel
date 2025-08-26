export function computeTrilevelPayouts({
  buyerId,
  amount,
  percentages,
  getSponsorOf,
  capPerTx = null,
  rounding = 'round-2'
}) {
  if (!amount || amount <= 0) return [];

  const round = value => rounding === 'floor-2'
    ? Math.floor(value * 100) / 100
    : rounding === 'ceil-2'
    ? Math.ceil(value * 100) / 100
    : Math.round(value * 100) / 100;

  const payouts = [];
  const visited = new Set([buyerId]);
  let user = buyerId;

  for (let level = 0; level < percentages.length; level++) {
    user = getSponsorOf(user);
    if (!user || visited.has(user)) break;
    visited.add(user);

    const amountToPay = Math.min(round(amount * percentages[level]), capPerTx ?? Infinity);
    if (amountToPay > 0) {
      payouts.push({ level: level + 1, userId: user, percent: percentages[level], amount: amountToPay });
    }
  }

  return payouts;
}
