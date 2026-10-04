export const USD_RATE = 610; // 1 USD ≈ 610 FCFA (indicatif)

export const formatFcfa = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

export const formatUsd = (n: number) =>
  "$" + new Intl.NumberFormat("en-US").format(Math.round(n / USD_RATE));
