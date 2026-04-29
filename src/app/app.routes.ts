import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Main } from './components/main/main';
import { Home } from './components/home/home';
import { AboutUs } from './components/about-us/about-us';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path:"login",
        component: Login
    },
    {
        path:"signup",
        component: Signup
    },
    {
        path: "main",
        component: Main,
        children: [
            {
                path:"",
                redirectTo:"home",
                pathMatch:'full'
            },
            {
                path:"home",
                component: Home
            },
            {
                path:"about",
                component: AboutUs
            }
        ]
    }
];
