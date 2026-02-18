# Math

Pure functions in `lib/math/odds.ts`:
- american odds -> implied probability
- american odds -> payout multiplier
- fair probability -> fair odds
- two-way vig removal
- weighted blending with missing-book renormalization
- EV% calculation

Weights: Pinnacle 30%, Circa 25%, Bookmaker/BetCRIS 20%, DraftKings 10%, FanDuel 10%, BetMGM 5%.

Vig removal (two-way): divide each implied probability by the two-side sum.

EV: `EV% = (p_fair * payout_multiplier) - 1`.
