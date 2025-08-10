export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string; // NEW
}

export interface CartDto {
  items: CartItemDto[];
  subtotal: number;
  total: number;
  delivery: number;
}
