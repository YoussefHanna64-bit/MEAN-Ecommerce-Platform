import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cartService';
import { UserService } from '../../Services/userService';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  cartService = inject(CartService);
  userService = inject(UserService);
  router = inject(Router);
  showUserMenu = false;

  ngOnInit() {
    this.cartService.viewCart().subscribe({
      next: (res) => this.cartService.cartItemsCount.set(res.cartItems.length),
    });
  }

  goToCart() {
    this.router.navigate(['/main/cart']);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  goToOrders() {
    this.showUserMenu = false;
    this.router.navigate(['/main/orders']);
  }

  goToProfile() {
    this.showUserMenu = false;
    this.router.navigate(['/main/profile']);
  }

  logout() {
    this.showUserMenu = false;
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
