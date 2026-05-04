import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgxStripeModule, StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js';
import { environment as env } from '../../../environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxStripeModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  encapsulation: ViewEncapsulation.None,
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;

  showSuccess = false;
  isLoading = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': { color: '#aab7c4' },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  paymentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private stripeService: StripeService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      amount: [{ value: 100, disabled: true }],
    });
  }

  pay(): void {
    if (this.paymentForm.valid) {
      const amount = this.paymentForm.getRawValue().amount;
      this.isLoading = true;
      this.createPaymentIntent(amount)
        .pipe(
          switchMap((response: any) =>
            this.stripeService.confirmCardPayment(response.data.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.paymentForm.get('name')?.value,
                },
              },
            }),
          ),
        )
        .subscribe((result) => {
          if (result.error) {
            console.error('Payment failed:', result.error.message);
            this.isLoading = false;
          } else {
            if (result.paymentIntent?.status === 'succeeded') {
              this.isLoading = false;
              this.showSuccess = true;
              this.cdr.detectChanges();
              setTimeout(() => {
                this.router.navigate(['/main/home']);
              }, 3500);
            }
          }
        });
    }
  }

  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(`${env.apiUrl}/payment/create-payment-intent`, { amount });
  }
}
