export interface MockProduct {
  id: string;
  particulars: string;
  defaultRate: number;
  category: 'food' | 'beverage' | 'bakery';
}

export const mockProducts: MockProduct[] = [
  { id: 'p-1', particulars: 'Chicken Steam Momo', defaultRate: 220, category: 'food' },
  { id: 'p-2', particulars: 'Veg Steam Momo', defaultRate: 160, category: 'food' },
  { id: 'p-3', particulars: 'Chicken Chilli Momo (C-Momo)', defaultRate: 280, category: 'food' },
  { id: 'p-4', particulars: 'Buff Sukuti Sadeko', defaultRate: 320, category: 'food' },
  { id: 'p-5', particulars: 'Paneer Butter Masala', defaultRate: 350, category: 'food' },
  { id: 'p-6', particulars: 'Garlic Butter Naan', defaultRate: 70, category: 'food' },
  { id: 'p-7', particulars: 'Chicken Biryani with Raita', defaultRate: 420, category: 'food' },
  { id: 'p-8', particulars: 'Special Masala Milk Tea', defaultRate: 50, category: 'beverage' },
  { id: 'p-9', particulars: 'Iced Cold Coffee with Ice Cream', defaultRate: 190, category: 'beverage' },
  { id: 'p-10', particulars: 'Fresh Lemon Soda', defaultRate: 120, category: 'beverage' },
  { id: 'p-11', particulars: 'Himalayan Mineral Water', defaultRate: 45, category: 'beverage' },
  { id: 'p-12', particulars: 'Chocolate Croissant', defaultRate: 150, category: 'bakery' },
  { id: 'p-13', particulars: 'Blueberry Cheesecake Slice', defaultRate: 260, category: 'bakery' },
];
