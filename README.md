# Quickbill — Fonepay Digital Bill Generator

A mobile mini app for Fonepay merchants in Nepal. Its whole flow is **Create Bill → Get Paid → Share**.

> **This is a prototype.** It is a high-fidelity, functional prototype built to present the product and test the user flow. It does **not** connect to real Fonepay authentication, payment APIs, QR generation, or any backend. Merchant data, payments, and transactions are all simulated. See [`docs/prototype-rules.md`](docs/prototype-rules.md).

## Features

- **Consent & sign-in (simulated):** a mock Fonepay login loads read-only merchant details (business name, PAN/VAT, address, contact).
- **Dashboard:** a prominent **Create Sales** button, sales totals for Today / Yesterday / This week / This month or a custom date range (compared with the previous period), and the 10 most recent sales.
- **Create sale:** add line items (name, quantity, rate, discount). Item names autocomplete from earlier sales using fuzzy matching, and popular items show up as quick-pick chips.
- **Automatic calculations:** item amount, subtotal, discount, net amount, and amount in words, all computed in one place.
- **Auto-generated bill details:** invoice number (`INV-000125`), date and time, and transaction ID (`FP-98234812`).
- **Bill preview:** an itemised tax invoice you can **Edit** (your entries are kept) or **Confirm**.
- **Payment:** **Cash** or **Fonepay QR**. The QR flow simulates *Pending → Paid*, and you can also trigger *Failed* to test the retry path.
- **Share the bill:** creates a PDF invoice and opens the native share sheet (on web, it opens the print dialog).
- **Sales history:** newest sales first, 10 per page, with a detail view where you can share any earlier bill again.
- **Settings:** Light / Dark / System appearance, plus a choice of app font.

## Tech stack

| Area | Library |
| --- | --- |
| Framework | [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), React Native 0.86, React 19.2 |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, typed routes) |
| Language | TypeScript, with React Compiler enabled |
| State | React Context (`AppContext`, `SaleContext`, `ItemHistoryContext`) |
| Persistence | `@react-native-async-storage/async-storage` (item autocomplete history only) |
| Bills | `expo-print` (HTML → PDF) + `expo-sharing` |
| UI | `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`, `@expo/vector-icons`, Expo Google Fonts |

## Getting started

### Prerequisites

- Node.js (LTS) and npm
- One of the following:
  - the [Expo Go](https://expo.dev/go) app on a phone
  - an Android emulator / iOS simulator
  - a web browser

### Install and run

```bash
npm install
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for web, or scan the QR code with Expo Go.

### Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in the browser |
| `npm run lint` | Run ESLint via `expo lint` |

> ⚠️ Don't run `npm run reset-project`. It is left over from the Expo template, and it moves the app source out and replaces it with a blank project.

## Project structure

```
src/
├── app/                 # Expo Router screens
│   ├── index.tsx        # Entry: "Bills" folder list → Quickbill
│   ├── dashboard/       # Summary, recent sales, settings
│   ├── sales/           # Create sale → bill preview → payment → payment status → success
│   ├── history/         # Sales history list + transaction detail ([id])
│   └── profile/         # Merchant profile
├── components/
│   ├── bill/            # BillPreview (shared by preview and final bill)
│   ├── sales/           # Line items, item-name autocomplete, QR sheet, date/period sheets
│   ├── history/         # TransactionCard
│   ├── layout/          # Screen, Header, BottomActionBar
│   ├── settings/        # SettingsSheet
│   └── ui/              # Button, Card, Chip, Input, BottomSheet, Modal, …
├── store/               # React Context providers (app, active sale, item history)
├── hooks/               # useSale, usePayment, useTransactions, useDashboardSummary, useShareBill
├── utils/               # calculations, currency, invoice IDs, PDF/share, sales periods, fuzzy match
├── data/                # Mock merchant, products, transactions; item history storage
├── theme/               # ThemeProvider, palette, fonts, makeStyles
├── constants/           # App config, spacing, radius, typography, motion, shadows
└── types/               # Sale, Transaction, Merchant, Payment types
docs/
├── product-requirements.md
└── prototype-rules.md
scripts/
└── make-icons.mjs       # One-off generator for app icons and splash (uses sharp)
```

## Architecture notes

- **One source of truth for the active sale.** `SaleContext` keeps the current sale across *Create → Preview → Edit → Payment → Success → Bill*. Don't copy the sale model into individual screens.
- **All money maths lives in `src/utils/calculations.ts`.** Subtotal, discount, net amount, and amount in words are calculated only there.
- **One bill component.** The bill preview and the final bill both render with `components/bill/BillPreview.tsx`.
- **Simulation settings** are in `src/constants/config.ts`: currency (`Rs.` / NPR), page sizes, and the simulated delays for auth, payment verification, and sharing.
- **Mock data** is in `src/data/`. Transactions are kept in memory and reset when the app restarts. Only the item autocomplete history is saved to AsyncStorage.

## Building with EAS

The project is set up for [EAS Build](https://docs.expo.dev/build/introduction/) with three profiles in `eas.json`:

```bash
npx eas-cli build --profile development   # dev client, internal distribution
npx eas-cli build --profile preview       # internal test build
npx eas-cli build --profile production    # store build (auto-incremented version)
```

## Web deployment (Vercel)

The web app is hosted at <https://fonepay-bill.vercel.app>. `vercel.json` configures the build:

- **Build:** `expo export -p web`, with output written to `dist/`. Because `web.output` is `"static"`, every route becomes its own HTML file.
- **Routing:** `cleanUrls` serves `/dashboard` from `dashboard/index.html`. Rewrites send dynamic URLs (`/history/:id` and the `[...rest]` catch-alls) to their generated HTML files.

Every push to `main` is deployed automatically through the Vercel Git integration.

## Documentation

- [Product requirements](docs/product-requirements.md): screens, flows, and business rules
- [Prototype rules](docs/prototype-rules.md): what's in scope, what's forbidden, and the architecture invariants
- [Expo SDK 57 docs](https://docs.expo.dev/versions/v57.0.0/): use the versioned docs, since Expo APIs change between SDKs
