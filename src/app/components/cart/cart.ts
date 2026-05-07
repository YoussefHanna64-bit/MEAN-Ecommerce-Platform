import { Component } from '@angular/core';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-cart',
  imports: [ProductCard],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {}
