import { Routes } from '@angular/router';
import { ProductsComponent } from './products/product.component';
import { CartComponent } from './cart/cart.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: '', component: ProductsComponent, canActivate: [AuthGuard] },
  // Optionally: { path: '**', redirectTo: '', pathMatch: 'full' }
];
