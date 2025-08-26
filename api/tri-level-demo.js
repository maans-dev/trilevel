import { computeTrilevelPayouts } from '../payouts.js';

// Simple demo users (same tree as local server)
const users = {
  A: { id: 'A', sponsorId: null },
  B: { id: 'B', sponsorId: 'A' },
  C: { id: 'C', sponsorId: 'B' },
  D: { id: 'D', sponsorId: 'C' },
  E: { id: 'E', sponsorId: 'D' },
  F: { id: 'F', sponsorId: 'B' }
};

const getSponsorOf = id => users[id]?.sponsorId ?? null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    buyerId = 'E',
    amount = 1000,
    percentages = [0.10, 0.06, 0.03],
    maxLevels = 3,
    capPerTx = null,
    rounding = 'round-2'
  } = req.body || {};

  try {
    const payouts = computeTrilevelPayouts({ buyerId, amount, percentages, maxLevels, capPerTx, rounding, getSponsorOf });
    const total = payouts.reduce((s, p) => s + p.amount, 0);
    return res.json({ buyerId, amount, payouts, total });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
