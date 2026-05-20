import { Component, inject, OnInit, AfterViewInit, ViewEncapsulation, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
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
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  encapsulation: ViewEncapsulation.None,
})
export class PaymentComponent implements OnInit, AfterViewInit {
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  showSuccess = false;
  isLoading = false;
  cartTotal = 0;
  formattedTotalAmount = '0.00';
  cardError: string | null = null;

  paymentForm!: FormGroup;
  orderService = inject(OrderService);

  private stripe: Stripe | null = null;
  private cardElement: StripeCardElement | null = null;
  private stripePromise = loadStripe(env.stripe.publicKey);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const currentUser = this.userService.user();

    this.paymentForm = this.fb.group({
      firstName: [currentUser?.firstName || '', Validators.required],
      lastName:  [currentUser?.lastName  || '', Validators.required],
      email:     [currentUser?.email     || '', [Validators.required, Validators.email]],
      address:   ['', Validators.required],
    });

    this.cartService.viewCart().subscribe({
      next: (res) => {
        this.cartTotal = res.totalPrice;
        this.formattedTotalAmount = (this.cartTotal * 1.14).toFixed(2);
        this.cdr.detectChanges();
      },
    });
  }

  async ngAfterViewInit() {
    this.stripe = await this.stripePromise;
    if (!this.stripe) return;

    const elements = this.stripe.elements();
    this.cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          '::placeholder': { color: '#aab7c4' },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    });

    this.cardElement.mount(this.cardElementRef.nativeElement);

    this.cardElement.on('change', (event) => {
      this.cardError = event.error ? event.error.message : null;
      this.cdr.detectChanges();
    });
  }

  async placeOrder() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      const controls = this.paymentForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          this.notificationService.show(`Please check the field: ${name}`, 'Warning');
        }
      }
      return;
    }

    if (this.isLoading) return;

    if (!this.cartTotal) {
      this.notificationService.show('Your cart is empty.', 'Warning');
      return;
    }

    if (!this.stripe || !this.cardElement) {
      this.notificationService.show('Stripe is not ready. Please wait.', 'Warning');
      return;
    }

    const finalAmount = Number((this.cartTotal * 1.14).toFixed(2));
    this.isLoading = true;

    this.createPaymentIntent(finalAmount).subscribe({
      next: async (res: any) => {
        const clientSecret = res.clientSecret;

        const { paymentIntent, error } = await this.stripe!.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.cardElement!,
            billing_details: {
              name:  `${this.paymentForm.value.firstName} ${this.paymentForm.value.lastName}`,
              email: this.paymentForm.value.email,
            },
          },
        });

        if (error) {
          this.isLoading = false;
          this.notificationService.show(error.message || 'Payment failed.', 'Warning');
          this.cdr.detectChanges();
          return;
        }

        if (paymentIntent?.status === 'succeeded') {
          const orderData: any = {
            userId:        this.userService.user()?._id,
            address:       this.paymentForm.value.address,
            paymentMethod: 'card',
          };

          this.orderService.addOrder(orderData).subscribe({
            next: () => {
              this.isLoading = false;
              this.showSuccess = true;
              this.cdr.detectChanges();
              setTimeout(() => {
                this.cartService.cartItemsCount.set(0);
                this.router.navigate(['/main/home']);
              }, 3500);
            },
            error: () => {
              this.isLoading = false;
              this.notificationService.show('Payment confirmed, but order record failed.', 'Warning');
              this.cdr.detectChanges();
            },
          });
        }
      },
      error: (e) => {
        this.isLoading = false;
        this.notificationService.show(e.error?.message || 'Payment failed.', 'Warning');
        this.cdr.detectChanges();
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