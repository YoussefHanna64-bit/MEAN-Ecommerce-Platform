import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { MainGuard } from './guards/main-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'main',
    component: Main,
    canActivate: [MainGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about-us/about-us').then((m) => m.AboutUs),
      },
      {
        path: 'payment',
        loadComponent: () => import('./pages/payment/payment').then((m) => m.PaymentComponent),
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPage),
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders').then((m) => m.OrdersPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfilePage),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./pages/product-details/product-details').then((m) => m.ProductDetails),
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
