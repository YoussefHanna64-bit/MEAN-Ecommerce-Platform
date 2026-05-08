import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environment';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cartService';
import { UserService } from '../../Services/userService';
import { NotificationService } from '../../Services/notificationServices';
import { OrderService } from '../../Services/orderServices';
import { Order } from '../../models/orderModel';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  encapsulation: ViewEncapsulation.None,
})
export class PaymentComponent implements OnInit {
  showSuccess = false;
  isLoading = false;
  cartTotal = 0;

  paymentForm!: FormGroup;
  orderService = inject(OrderService);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    const currentUser = this.userService.user();

    this.paymentForm = this.fb.group({
      firstName: [currentUser?.firstName || '', Validators.required],
      lastName: [currentUser?.lastName || '', Validators.required],
      email: [currentUser?.email || '', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9 ]{19}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    });

    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartTotal = res.totalPrice;
      },
    });
  }

  formatCardNumber(event: any) {
    let val = event.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
    this.paymentForm.get('cardNumber')?.setValue(formatted.substring(0, 19));
  }

  formatExpiryDate(event: any) {
    let val = event.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    this.paymentForm.get('expiryDate')?.setValue(val);
  }

  placeOrder() {
    if (this.paymentForm.invalid || this.isLoading) {
      return;
    }

    if (!this.cartTotal) {
      this.notificationService.show('Your cart is empty.', 'Warning');
      return;
    }

    const finalAmount = Number((this.cartTotal * 1.14).toFixed(2));

    this.isLoading = true;
    this.createPaymentIntent(finalAmount).subscribe({
      next: () => {
        const orderData: any = {
          userId: this.userService.user()?._id,
          paymentMethod: 'card',
        };

        this.orderService.addOrder(orderData).subscribe({
          next: () => {
            this.isLoading = false;
            this.showSuccess = true;

            this.cartService.cartItemsCount.set(0);

            setTimeout(() => {
              this.router.navigate(['/main/home']);
            }, 3500);
          },
          error: (e) => {
            this.isLoading = false;
            this.notificationService.show('Payment confirmed, but order record failed.', 'Warning');
          },
        });
      },
      error: (e) => {
        this.isLoading = false;
        this.notificationService.show(
          e.error?.message || 'Failed to process payment. Please try again.',
          'Warning',
        );
      },
    });
  }

  createPaymentIntent(amount: number): Observable<unknown> {
    return this.http.post(`${env.apiUrl}/payment/create-payment-intent`, {
      amount,
      customer: this.paymentForm.getRawValue(),
    });
  }
}
