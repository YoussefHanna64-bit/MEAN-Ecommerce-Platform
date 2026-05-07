import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cartService';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  cartService = inject(CartService);
  router = inject(Router);

  ngOnInit() {
    this.cartService.viewCart().subscribe({
      next: (res) => this.cartService.cartItemsCount.set(res.cartItems.length),
    });
  }

  goToCart() {
    this.router.navigate(['/main/cart']);
  }
}
