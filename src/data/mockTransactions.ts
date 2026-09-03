import { Transaction } from '@/types/transaction';
import { Sale } from '@/types/sale';
import { convertAmountToWords } from '@/utils/calculations';

function createMockSale(
  id: string,
  seq: number,
  date: string,
  time: string,
  items: Array<{ particulars: string; quantity: number; rate: number }>,
  discount: number,
  paymentMode: 'cash' | 'fonepay',
  paymentStatus: 'paid' | 'pending' | 'failed',
  customerName?: string
): Transaction {
  const saleItems = items.map((it, idx) => ({
    id: `${id}-item-${idx + 1}`,
    particulars: it.particulars,
    quantity: it.quantity,
    rate: it.rate,
    amount: it.quantity * it.rate,
  }));

  const subtotal = saleItems.reduce((sum, it) => sum + it.amount, 0);
  const netAmount = Math.max(0, subtotal - discount);
  const invoiceNumber = `INV-${String(seq).padStart(6, '0')}`;
  const transactionId = `FP-${90000000 + seq * 137}`;

  const saleDetails: Sale = {
    id,
    invoiceNumber,
    invoiceDate: date,
    invoiceTime: time,
    transactionId,
    items: saleItems,
    subtotal,
    discount,
    netAmount,
    paymentMode,
    paymentStatus,
    amountInWords: convertAmountToWords(netAmount),
    customerName,
    createdAt: `${date}T${time}:00Z`,
  };

  return {
    id,
    invoiceNumber,
    date,
    time,
    amount: netAmount,
    paymentMode,
    paymentStatus,
    itemsCount: saleItems.length,
    customerName,
    saleDetails,
  };
}

export const mockTransactions: Transaction[] = [
  createMockSale('tx-125', 125, '2026-09-03', '02:45 PM', [
    { particulars: 'Chicken Steam Momo', quantity: 2, rate: 220 },
    { particulars: 'Iced Cold Coffee with Ice Cream', quantity: 2, rate: 190 },
  ], 20, 'fonepay', 'paid', 'Aayush Shrestha'),

  createMockSale('tx-124', 124, '2026-09-03', '02:10 PM', [
    { particulars: 'Paneer Butter Masala', quantity: 1, rate: 350 },
    { particulars: 'Garlic Butter Naan', quantity: 3, rate: 70 },
    { particulars: 'Fresh Lemon Soda', quantity: 2, rate: 120 },
  ], 0, 'cash', 'paid', 'Pooja Thapa'),

  createMockSale('tx-123', 123, '2026-09-03', '01:25 PM', [
    { particulars: 'Chicken Biryani with Raita', quantity: 2, rate: 420 },
    { particulars: 'Himalayan Mineral Water', quantity: 2, rate: 45 },
  ], 50, 'fonepay', 'paid', 'Bikash Adhikari'),

  createMockSale('tx-122', 122, '2026-09-03', '12:50 PM', [
    { particulars: 'Veg Steam Momo', quantity: 3, rate: 160 },
    { particulars: 'Special Masala Milk Tea', quantity: 3, rate: 50 },
  ], 0, 'fonepay', 'pending', 'Rohan Gurung'),

  createMockSale('tx-121', 121, '2026-09-03', '12:15 PM', [
    { particulars: 'Chicken Chilli Momo (C-Momo)', quantity: 1, rate: 280 },
    { particulars: 'Fresh Lemon Soda', quantity: 1, rate: 120 },
  ], 0, 'cash', 'paid', 'Sita Sharma'),

  createMockSale('tx-120', 120, '2026-09-03', '11:40 AM', [
    { particulars: 'Buff Sukuti Sadeko', quantity: 2, rate: 320 },
    { particulars: 'Himalayan Mineral Water', quantity: 1, rate: 45 },
  ], 30, 'fonepay', 'failed', 'Kiran KC'),

  createMockSale('tx-119', 119, '2026-09-03', '11:05 AM', [
    { particulars: 'Special Masala Milk Tea', quantity: 4, rate: 50 },
    { particulars: 'Chocolate Croissant', quantity: 2, rate: 150 },
  ], 0, 'cash', 'paid', 'Nabin Maharjan'),

  createMockSale('tx-118', 118, '2026-09-03', '10:30 AM', [
    { particulars: 'Blueberry Cheesecake Slice', quantity: 2, rate: 260 },
    { particulars: 'Iced Cold Coffee with Ice Cream', quantity: 2, rate: 190 },
  ], 0, 'fonepay', 'paid', 'Sunita Joshi'),

  createMockSale('tx-117', 117, '2026-09-03', '09:45 AM', [
    { particulars: 'Special Masala Milk Tea', quantity: 2, rate: 50 },
  ], 0, 'cash', 'paid', 'Ram Prasad'),

  createMockSale('tx-116', 116, '2026-09-02', '08:20 PM', [
    { particulars: 'Chicken Biryani with Raita', quantity: 3, rate: 420 },
    { particulars: 'Fresh Lemon Soda', quantity: 3, rate: 120 },
  ], 100, 'fonepay', 'paid', 'Pradeep Karki'),

  // Page 2 records
  createMockSale('tx-115', 115, '2026-09-02', '07:45 PM', [
    { particulars: 'Buff Sukuti Sadeko', quantity: 1, rate: 320 },
    { particulars: 'Chicken Steam Momo', quantity: 2, rate: 220 },
  ], 0, 'fonepay', 'paid', 'Dipen Rai'),

  createMockSale('tx-114', 114, '2026-09-02', '06:30 PM', [
    { particulars: 'Veg Steam Momo', quantity: 2, rate: 160 },
    { particulars: 'Fresh Lemon Soda', quantity: 2, rate: 120 },
  ], 20, 'cash', 'paid', 'Anita Basnet'),

  createMockSale('tx-113', 113, '2026-09-02', '05:15 PM', [
    { particulars: 'Chicken Chilli Momo (C-Momo)', quantity: 2, rate: 280 },
    { particulars: 'Iced Cold Coffee with Ice Cream', quantity: 1, rate: 190 },
  ], 0, 'fonepay', 'paid', 'Suresh Tamang'),

  createMockSale('tx-112', 112, '2026-09-02', '04:00 PM', [
    { particulars: 'Special Masala Milk Tea', quantity: 5, rate: 50 },
    { particulars: 'Chocolate Croissant', quantity: 3, rate: 150 },
  ], 25, 'cash', 'paid', 'Hari Kumar'),

  createMockSale('tx-111', 111, '2026-09-02', '03:10 PM', [
    { particulars: 'Paneer Butter Masala', quantity: 2, rate: 350 },
    { particulars: 'Garlic Butter Naan', quantity: 4, rate: 70 },
  ], 40, 'fonepay', 'paid', 'Sarita Dangol'),

  createMockSale('tx-110', 110, '2026-09-02', '02:00 PM', [
    { particulars: 'Chicken Steam Momo', quantity: 1, rate: 220 },
    { particulars: 'Special Masala Milk Tea', quantity: 1, rate: 50 },
  ], 0, 'cash', 'paid', 'Gopal Khadka'),

  createMockSale('tx-109', 109, '2026-09-02', '01:15 PM', [
    { particulars: 'Chicken Biryani with Raita', quantity: 1, rate: 420 },
  ], 0, 'fonepay', 'failed', 'Deepak Rana'),

  createMockSale('tx-108', 108, '2026-09-02', '12:30 PM', [
    { particulars: 'Blueberry Cheesecake Slice', quantity: 1, rate: 260 },
    { particulars: 'Iced Cold Coffee with Ice Cream', quantity: 1, rate: 190 },
  ], 0, 'fonepay', 'paid', 'Manish Shrestha'),

  createMockSale('tx-107', 107, '2026-09-02', '11:20 AM', [
    { particulars: 'Veg Steam Momo', quantity: 2, rate: 160 },
    { particulars: 'Himalayan Mineral Water', quantity: 2, rate: 45 },
  ], 0, 'cash', 'paid', 'Kamala Pandey'),

  createMockSale('tx-106', 106, '2026-09-02', '10:10 AM', [
    { particulars: 'Special Masala Milk Tea', quantity: 2, rate: 50 },
    { particulars: 'Chocolate Croissant', quantity: 1, rate: 150 },
  ], 0, 'fonepay', 'paid', 'Ramesh Dahal'),

  // Page 3 records
  createMockSale('tx-105', 105, '2026-09-01', '08:45 PM', [
    { particulars: 'Chicken Biryani with Raita', quantity: 4, rate: 420 },
    { particulars: 'Fresh Lemon Soda', quantity: 4, rate: 120 },
  ], 120, 'fonepay', 'paid', 'Umesh Silwal'),

  createMockSale('tx-104', 104, '2026-09-01', '07:15 PM', [
    { particulars: 'Chicken Chilli Momo (C-Momo)', quantity: 3, rate: 280 },
  ], 40, 'cash', 'paid', 'Sabina Giri'),

  createMockSale('tx-103', 103, '2026-09-01', '06:00 PM', [
    { particulars: 'Paneer Butter Masala', quantity: 1, rate: 350 },
    { particulars: 'Garlic Butter Naan', quantity: 2, rate: 70 },
  ], 0, 'fonepay', 'paid', 'Bibek Bista'),

  createMockSale('tx-102', 102, '2026-09-01', '04:30 PM', [
    { particulars: 'Buff Sukuti Sadeko', quantity: 2, rate: 320 },
  ], 0, 'cash', 'paid', 'Prakash Poudel'),

  createMockSale('tx-101', 101, '2026-09-01', '02:15 PM', [
    { particulars: 'Chicken Steam Momo', quantity: 2, rate: 220 },
    { particulars: 'Special Masala Milk Tea', quantity: 2, rate: 50 },
  ], 0, 'fonepay', 'paid', 'Niraj Shakya'),
];
