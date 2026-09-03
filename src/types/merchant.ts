export interface Merchant {
  id: string;
  businessName: string;
  panVatNumber: string;
  address: string;
  contactNumber: string;
  email?: string;
  merchantCode?: string;
  terminalId?: string;
}
