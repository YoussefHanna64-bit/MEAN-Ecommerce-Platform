import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductService } from '../../Services/productServices';
import { Product } from '../../models/productModel';
import { CartService } from '../../Services/cartService';
import { NotificationService } from '../../Services/notificationServices';
import { CategoryService } from '../../Services/categoryServices';
import { Category } from '../../models/categoryModel';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  ngOnInit() {
    this.loadCategories();
  }
  cartService = inject(CartService);
  notificationService = inject(NotificationService);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data?.categories!);
        this.loadProducts();
      },
      error: (err) => console.error('Failed to load categories', err),
    });
  }
  loadProducts() {
    //console.log('Loading products');
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data?.products!);
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }
  addToCart(productId: string | undefined) {
    if (!productId) {
      return;
    }

    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.cartService.cartItemsCount.set(res.cartItems.length);
        this.notificationService.show('Added to cart successfully.', 'Success');
      },
      error: (err) => {
        this.notificationService.show(
          err.error?.message || 'Failed to add item to cart.',
          'Delete',
        );
      },
    });
  }
}
