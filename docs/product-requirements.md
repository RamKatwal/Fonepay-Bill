# Fonepay Digital Bill Generator — Product Requirements

## 1. Product Overview
The **Fonepay Digital Bill Generator** is a mini app for Fonepay merchants in Nepal.
Its core purpose is:
**Create Bill → Get Paid → Share**

## 2. Core Capabilities
1. **Consent & Authentication**: Merchant authenticates with consent; merchant information is fetched and read-only.
2. **Merchant Information**:
   - Business Name (e.g., Everest Café)
   - PAN / VAT Number (e.g., 600123456)
   - Business Address (e.g., Kathmandu, Nepal)
   - Contact Number (e.g., +977 9801234567)
3. **Dashboard**:
   - Primary CTA: **Create Sales** (visually dominant)
   - Secondary Navigation: **View All Sales History**
   - Summary statistics (today's sales count, total volume)
   - Displays latest 10 sales with invoice number, date, amount, payment mode, and status.
4. **Create Sales**:
   - Quick addition of items: Particulars / Item Name, Quantity, Rate, Discount.
   - Centralized automatic calculation of:
     - Item Amount = Quantity × Rate
     - Subtotal = Sum of Item Amounts
     - Net Amount = Subtotal − Discount
   - Auto-generated:
     - Invoice Number (e.g., INV-000125)
     - Invoice Date & Time
     - Transaction ID (e.g., FP-98234812)
5. **Bill Preview & Edit**:
   - Shows read-only merchant info, bill metadata, itemized table, subtotal, discount, net amount, and amount in words.
   - Dual actions: **Edit** (returns to sales entry preserving state) and **Confirm** (proceeds to payment).
   - Recalculates immediately upon any item or discount change.
6. **Payment Selection**:
   - Two modes: **Cash** and **Fonepay**.
   - Always keeps the net bill amount clearly visible.
7. **Fonepay QR Simulation**:
   - Dynamic QR placeholder, amount, invoice number, and merchant details.
   - Simulated states:
     - **Pending** (initial)
     - **Paid** (after short verification animation)
     - **Failed** (for testing error/retry flows)
8. **Bill Generation & Sharing**:
   - Success confirmation screen.
   - Final generated bill matching the preview structure.
   - Native share action simulation (or fallback share sheet).
   - Automatically saves completed transaction to local history.
9. **Sales History**:
   - Newest transactions first.
   - 10 records per page local pagination.
   - Transaction detail view with option to open and reprint/share previous bill.
