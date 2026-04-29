import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);

  switchToLogin() {
    this.router.navigate(['/login']);
  }

  switchToSignup() {
    this.router.navigate(['/signup']);
  }

  loginValidation() {
    this.router.navigate(['/main/home']);
  }
}
