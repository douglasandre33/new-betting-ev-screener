# Architecture

Flow:
1. Fetch odds from The Odds API (fallback to demo fixture).
2. Normalize books/markets into canonical quote records.
3. Persist snapshots in Prisma (`Book`, `Event`, `Market`, `OddsSnapshot`).
4. Query latest snapshots per market/book and dedupe by canonical market + book.
5. Compute weighted fair probability and EV opportunities.
6. Render dashboard with pagination, column chooser, search, and details drawer.

Robustness:
- Refresh endpoint includes simple rate limiting.
- Background refresh polling updates with warning banner on failure.
- Structured server logging on refresh success/failure.
- Demo mode keeps UI populated if API key is unavailable.
