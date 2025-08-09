export interface CartItemDto {
  id: number;
  quantity: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export interface CartDto {
  items: CartItemDto[];
  total: number;
}
