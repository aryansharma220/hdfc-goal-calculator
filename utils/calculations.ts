export const calculateGoalSIP = (pv: number, years: number, inflation: number, returns: number) => {
  // Defensive check: Agar values nahi hain toh calculation skip karo
  if (!pv || pv <= 0) return { futureGoalValue: 0, requiredSIP: 0 };

  const i = (inflation || 0) / 100;
  const fv = pv * Math.pow(1 + i, years || 1);
  
  const r = ((returns || 0) / 100) / 12;
  const n = (years || 1) * 12;

  let sip = 0;
  if (r === 0) {
    sip = fv / n;
  } else {
    const numerator = fv * r;
    const denominator = (Math.pow(1 + r, n) - 1) * (1 + r);
    sip = numerator / denominator;
  }

  return {
    futureGoalValue: Math.round(fv),
    requiredSIP: Math.round(sip),
  };
};