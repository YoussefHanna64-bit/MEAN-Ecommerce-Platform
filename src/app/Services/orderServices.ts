import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Order, OrderResponse } from '../models/orderModel';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = 'http://localhost:5000/api/order';
  private http = inject(HttpClient);
  
  orders = signal<Order[]>([]);

  getAllOrders() {
    return this.http.get<OrderResponse>(`${this.baseUrl}/`);
  }
  getOrderById(id: string) {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${id}`);
  }
  getOrdersByUserId(id: string) {
    return this.http.get<OrderResponse>(`${this.baseUrl}/user/${id}`);
  }
  addOrder(order: Order) {
    return this.http.post<OrderResponse>(`${this.baseUrl}/`, order);
  }

  deleteOrder(id: string) {
    return this.http.delete<OrderResponse>(`${this.baseUrl}`, { body: { id } });
  }
}
