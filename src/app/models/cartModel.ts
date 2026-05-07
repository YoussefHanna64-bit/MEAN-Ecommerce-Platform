import { Product } from './productModel';

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  success: string;
  userName: string;
  cartItems: CartItem[];
  totalPrice: number;
}
