export interface OrderProduct {
  productId: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
  images: any[];
  _id: string;
}

export interface Order {
  _id: string;
  userId: string;
  cartId: string;
  address: string;
  products: OrderProduct[];
  totalPrice: number;
  paymentMethod: 'card' | 'cash' | 'online';
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrderResponse {
  data: Order[];
}
