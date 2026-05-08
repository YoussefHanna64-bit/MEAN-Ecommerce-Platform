import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../models/orderModel';
import { OrderService } from '../../Services/orderServices';
import { UserService } from '../../Services/userService';
import { NotificationService } from '../../Services/notificationServices';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersPage implements OnInit {
  orderService = inject(OrderService);
  userService = inject(UserService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  loading = signal(true);

  ngOnInit(): void {
    const currentUser = this.userService.user();

    if (!currentUser?._id) {
      this.router.navigate(['/login']);
      return;
    }

    this.orderService.getOrdersByUserId(currentUser._id).subscribe({
      next: (res) => {
        this.orderService.orders.set(res.data || []);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.notificationService.show(
          e.error?.message || 'Failed to load orders. Please try again.',
          'Delete',
        );
      },
    });
  }
}
