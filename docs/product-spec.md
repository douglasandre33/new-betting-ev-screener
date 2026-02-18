# Product spec

## Supported leagues
NFL, NBA, NHL, NCAA Football, NCAA Men's Basketball, NCAA Baseball, EPL, La Liga, Serie A, Bundesliga, Ligue 1, UEFA Champions League.

## Supported markets
Main markets only: moneyline, spread, total.
No props/player markets/alt lines/futures/period markets/team totals.
Main line selection rule: when provider marks a main line, use it; otherwise choose spread nearest 0 and total nearest consensus.

## Soccer
MVP excludes 3-way moneyline markets. Soccer spreads/totals remain eligible.

## UI and transparency
- Pagination keeps table responsive for large datasets.
- Column chooser and saved preferences stored in localStorage.
- Details drawer shows per-book prices, implied probabilities, effective renormalized weights, and blended fair output.
- Non-blocking warnings surface fetch failures.

## Demo mode
If API fails or key is absent, fixture-driven demo mode can populate the dashboard.
