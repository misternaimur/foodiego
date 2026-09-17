export interface VendorOrder {
  id: string;
  clientName: string; // <-- fixes accessorKey error
  items: OrderItem[]; // <-- fixes property 'items' does not exist error
  total: number;
  status: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}