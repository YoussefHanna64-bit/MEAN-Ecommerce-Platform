import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Main } from './components/main/main';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';
import { PaymentComponent } from './components/payment/payment';
import { Chatpot } from './components/chatpot/chatpot';
import { CartPage } from './components/cart/cart';
import { ProductDetails } from './components/product-details/product-details';
import { OrdersPage } from './components/orders/orders';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup,
  },
  {
    path: 'main',
    component: Main,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'about',
        component: AboutUs,
      },
      {
        path: 'payment',
        component: PaymentComponent,
      },
      {
        path: 'cart',
        component: CartPage,
      },
      {
        path: 'orders',
        component: OrdersPage,
      },
      {
        path:"product/:id",
        component:ProductDetails
      }
    ],
  },
];
