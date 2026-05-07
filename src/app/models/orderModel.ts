export interface Order {
  _id?: string;            
  userId: string;           
  cartId: string;          
  totalPrice: number;
  paymentMethod: 'cash' | 'card' | 'online'; 
  createdAt?: string | Date;
  updatedAt?: string | Date;
  __v?: number
}
export interface OrderResponse {
  status: string;
  data?: {
    order: Order;
  };
  message?: string;
  code?: number;
}
