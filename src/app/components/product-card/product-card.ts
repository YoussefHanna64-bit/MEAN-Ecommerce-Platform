import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../../models/productModel';
import { CartService } from '../../Services/cartService';
import { NotificationService } from '../../Services/notificationServices';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;

  @Input() quantity: number = 1;
  @Output() cartUpdated = new EventEmitter<void>();

  cartService = inject(CartService);
  notificationService = inject(NotificationService);

  changeQuantity(num: number) {
    if (this.quantity === 1 && num === -1) {
      this.deleteItem();
      return;
    }

    this.cartService.addToCart(this.product._id!, num).subscribe({
      next: () => {
        this.cartUpdated.emit();
      },
      error: (e) => {
        this.notificationService.show(
          e.error?.message || 'Failed to update quantity. Please try again.',
          'Update',
        );
      },
    });
  }

  deleteItem() {
    this.cartService.removeFromCart(this.product._id!).subscribe({
      next: () => {
        this.cartUpdated.emit();
      },
      error: (e) => {
        this.notificationService.show(
          e.error?.message || 'Failed to remove item. Please try again.',
          'Delete',
        );
      },
    });
  }
}
