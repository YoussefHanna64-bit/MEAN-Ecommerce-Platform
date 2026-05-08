import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Services/userService';
import { NotificationService } from '../../Services/notificationServices';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  router = inject(Router);
  notificationService = inject(NotificationService);
  userService = inject(UserService);

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  signupForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() },
  );

  switchToLogin() {
    this.router.navigate(['/login']);
  }
  switchToSignup() {
    this.router.navigate(['/signup']);
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  signup() {
    if (this.signupForm.invalid) return;
    this.isLoading = true;
    const { firstName, lastName, phoneNumber, email, password } = this.signupForm.value;

    this.userService
      .signup(firstName, lastName, phoneNumber, email.toLowerCase(), password)
      .subscribe({
        next: (res) => {
          if (res.status === 'success' && res.data?.user) {
            this.userService.setCurrentUser(res.data.user);
            this.notificationService.show(
              `Welcome, ${res.data.user.firstName}! Your account has been created.`,
              'Success',
            );
            setTimeout(() => {
              this.isLoading = false;
              this.router.navigate(['/main/home']);
            }, 1500);
          }
        },
        error: (e) => {
          this.isLoading = false;
          this.notificationService.show(
            e.error?.message || 'Registration failed. Please try again.',
            'Warning',
          );
        },
      });
  }
}
