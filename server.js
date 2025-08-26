import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { computeTrilevelPayouts } from "./payouts.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const users = {
  A: { id: "A", sponsorId: null },
  B: { id: "B", sponsorId: "A" },
  C: { id: "C", sponsorId: "B" },
  D: { id: "D", sponsorId: "C" },
  E: { id: "E", sponsorId: "D" },
  F: { id: "F", sponsorId: "B" },
};

const getSponsorOf = id => users[id]?.sponsorId ?? null;

app.post("/tri-level-demo", (req, res) => {
  const {
    buyerId = "E",
    amount = 1000,
    percentages = [0.10, 0.06, 0.03],
    maxLevels = 3,
    capPerTx = null,
    rounding = "round-2"
  } = req.body || {};

  const payouts = computeTrilevelPayouts({
    buyerId,
    amount,
    percentages,
    maxLevels,
    capPerTx,
    rounding,
    getSponsorOf
  });

  const total = payouts.reduce((sum, p) => sum + p.amount, 0);

  res.json({ buyerId, amount, payouts, total });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Demo running at http://localhost:${PORT}`));
