import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Product } from '../../models/productModel';
import { ProductService } from '../../Services/productServices';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
 products = signal<Product[]>([]);
  productService = inject(ProductService);

  ngOnInit() {
    this.loadProducts();
  }
  loadProducts() {
    //console.log('Loading products');
    this.productService.getProducts().subscribe({
      next: (res) => {
        //console.log(res.data?.products);
       this.products.set(res.data?.products!);
       //console.log(this.products());
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }
}
