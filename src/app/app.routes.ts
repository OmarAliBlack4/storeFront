import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductsComponent } from './pages/products/products.component';
import { DetailsComponent } from './pages/details/details.component';
import { BasketComponent } from './pages/basket/basket.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';

export const routes: Routes = [
    {path:'',component:LandingComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'cart', component:BasketComponent},
    {path:'products', component:ProductsComponent},
    {path:'details', component:DetailsComponent},
    { path: 'orders', component: OrdersComponent },
    { path: 'admin-orders', component: AdminOrdersComponent },
];
