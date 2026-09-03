# Fonepay Digital Bill Generator — Prototype Rules

## 1. Prototype Scope
- This application is a **high-fidelity functional prototype for presentation and user-flow validation**.
- It is **NOT** a production backend-connected application.

## 2. STRICTLY FORBIDDEN Implementations
DO NOT build or connect:
- Real Fonepay authentication / OAuth
- Real Fonepay payment APIs or webhooks
- Real QR payment generation / dynamic bank switches
- Real databases (PostgreSQL, Supabase, Firebase)
- Real file storage / cloud buckets
- External invoice generation services

## 3. Approved Simulation Strategies
- **React Context State**: Single source of truth for current sale and global transactions repository.
- **Realistic Mock Data**: Nepal-specific merchants, Nepali rupee (`Rs.`), realistic PAN and telephone formats.
- **Simulated Delays & States**: Realistic loading timers for verification, pending states, and failure toggles.
- **Sequential Invoices & IDs**: Centralized generators for invoice numbers (`INV-000125`) and transaction IDs (`FP-XXXXXXXX`).

## 4. Architecture & State Invariants
- **Single Source of Truth**: The active sale state in `SaleContext` must survive across all screens:
  `Create Sale → Preview → Edit → Payment → Success → Bill`.
  Never duplicate sale models across separate screens.
- **Calculations**: Subtotal, discount, net amount, and amount-in-words must be computed exclusively via `src/utils/calculations.ts`.
- **Reusable Bill View**: The Bill Preview and Final Generated Bill must share the same underlying bill rendering component.
- **Read-Only Merchant Info**: Merchant details must clearly display as read-only.
