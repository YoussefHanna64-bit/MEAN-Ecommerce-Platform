import { Component, inject, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { CartService } from '../../Services/cartService';
import { Cart } from '../../models/cartModel';
import { NotificationService } from '../../Services/notificationServices';

@Component({
  selector: 'app-cart',
  imports: [ProductCard],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartPage {
  cartService = inject(CartService);
  notificationService = inject(NotificationService);

  cart = signal<Cart | null>(null);

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cart.set(res);
        console.log(res);
        this.cartService.cartItemsCount.set(res.cartItems.length);
      },

      error: (e) => {
        this.notificationService.show(
          e.error?.message || 'Failed to load cart. Please try again.',
          'Delete',
        );
      },
    });
  }
}
