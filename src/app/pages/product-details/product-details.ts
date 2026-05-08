import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/productServices';
import { Product } from '../../models/productModel';
import { CartService } from '../../Services/cartService';
import { NotificationService } from '../../Services/notificationServices';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  cartService = inject(CartService);
  notificationService = inject(NotificationService);

  product = signal<Product | null>(null);
  mainImage = signal<string | null>(null);
  quantity = signal<number>(1);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/main/home']);
      return;
    }

    this.productService.getProduct(id).subscribe({
      next: (res: any) => {
        const p = res.data?.products?.[0] || res.data?.product || res.data;
        this.product.set(p || null);
        this.mainImage.set(p?.images?.[0] || null);
      },
      error: (e) => {
        this.notificationService.show('Failed to load product.', 'Warning');
        this.router.navigate(['/main/home']);
      },
    });
  }

  setMain(img?: string) {
    if (img) this.mainImage.set(img);
  }

  changeQuantity(delta: number) {
    const current = this.quantity();
    const next = Math.max(1, current + delta);
    const stock = this.product()?.stock ?? 9999;
    if (next > stock) return;
    this.quantity.set(next);
  }

  addToCart(productId: string | undefined) {
    if (!productId) {
      return;
    }

    this.cartService.addToCart(productId).subscribe({
      next: (res: any) => {
        const items = res.cart?.products || [];
        this.cartService.cartItemsCount.set(items.length);
        this.notificationService.show('Added to cart successfully.', 'Success');
      },
      error: (err) => {
        this.notificationService.show('Failed to add item.', 'Delete');
      },
    });
  }
}
