import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Cart } from '../models/cartModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  baseUrl = 'http://localhost:5000/api/cart';
  http = inject(HttpClient);

  cartItemsCount = signal<number>(0);

  viewCart() {
    return this.http.get<Cart>(this.baseUrl);
  }

  addToCart(productId: string, quantity: number = 1) {
    return this.http.post<Cart>(this.baseUrl, {
      productId,
      quantity,
    });
  }

  removeFromCart(productId: string) {
    return this.http.patch<Cart>(this.baseUrl, { productId });
  }

  clearCart() {
    return this.http.delete(this.baseUrl);
  }
}
