import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../Services/cartService';
import { UserService } from '../../Services/userService';
import { ProductService } from '../../Services/productServices';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [RouterLink],
})
export class Header implements OnInit {
  cartService = inject(CartService);
  userService = inject(UserService);
  router = inject(Router);
  showUserMenu = false;
  productService = inject(ProductService);

  ngOnInit() {
    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartService.cart.set(res);
        this.cartService.cartItemsCount.set(res.cartItems.length);
      },
    });
  }
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.productService.searchQuery.set(value);
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
