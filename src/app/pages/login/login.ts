import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Services/userService';
import { NotificationService } from '../../Services/notificationServices';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);
  notificationService = inject(NotificationService);
  userService = inject(UserService);

  showPassword = false;
  loginError = false;
  isLoading = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  switchToLogin() {
    this.router.navigate(['/login']);
  }
  switchToSignup() {
    this.router.navigate(['/signup']);
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.loginError = false;
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.userService.login(email.toLowerCase(), password).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.user) {
          this.userService.setCurrentUser(res.data.user);
          this.notificationService.show(
            'Welcome back, ' + res.data.user.firstName + '!',
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
        this.loginError = true;
        this.notificationService.show(
          e.error?.message || 'Error happened. Please try again',
          'Warning',
        );
      },
    });
  }
}
