import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Product } from '../../models/productModel';
import { ProductService } from '../../Services/productServices';
import { Chatpot } from '../chatpot/chatpot';
import { HeroSectionComponent } from '../hero-section/hero-section';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Chatpot, HeroSectionComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  products = signal<Product[]>([]);
  chatpotOpen = signal<boolean>(false);
  productService = inject(ProductService);

  ngOnInit() {
    this.loadProducts();
  }

  toggleChatpot() {
    this.chatpotOpen.update((value) => !value);
  }

  onShopCollection() {
    // scroll to products or navigate — up to you
    document.querySelector('.product-card')?.scrollIntoView({ behavior: 'smooth' });
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
