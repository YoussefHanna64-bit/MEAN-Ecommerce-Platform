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

  login() {
    const { email, password } = this.loginForm.value;
    this.userService.login(email, password).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.user) {
          this.userService.setCurrentUser(res.data.user);
          this.router.navigate(['/main/home']);
          this.notificationService.show(
            'Welcome back, ' + res.data.user.firstName + '!',
            'Success',
          );
        }
      },
      error: (e) => {
        this.notificationService.show(
          e.error?.message || 'Error happened. Please try again',
          'Warning',
        );
      },
    });
  }
}
