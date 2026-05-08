import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductService } from '../../Services/productServices';
import { Product } from '../../models/productModel';
import { CartService } from '../../Services/cartService';
import { NotificationService } from '../../Services/notificationServices';
import { CategoryService } from '../../Services/categoryServices';
import { Category } from '../../models/categoryModel';
import { Categories } from '../categories/categories';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [Categories],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  ngOnInit() {
    this.loadCategories();
  }
  cartService = inject(CartService);
  notificationService = inject(NotificationService);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<string | null>(null);
  allProducts = signal<Product[]>([]);
  router = inject(Router);

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
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.allProducts.set(res.data?.products!);
        this.filterProducts();
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  filterProducts() {
    const selectedId = this.selectedCategory();
    if (!selectedId) {
      this.products.set(this.allProducts());
    } else {
      const selectedCategoryObject = this.categories().find((c) => c._id === selectedId);
      const selectedTitle = selectedCategoryObject?.title;
      const filtered = this.allProducts().filter((product) => {
        const productTitle = product.category?.title || product.category;
        return productTitle === selectedTitle;
      });

      this.products.set(filtered);
    }
  }

  selectCategory(categoryId: string | null) {
    this.selectedCategory.set(categoryId);
    this.filterProducts();
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

  openProduct(productId?: string) {
    if (!productId) return;
    this.router.navigate([`/main/product/${productId}`]);
  }
}
