import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: { product: Product, quantity: number }[] = [];
  deliveryCost: number = 20;
  showModal: boolean = false;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCartItems();
  }

  getTotalPrice() {
    return this.cartService.getTotalPrice();
  }

  getTotalWithDelivery() {
    return this.cartService.getTotalWithDelivery(this.deliveryCost);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
    this.cartItems = this.cartService.getCartItems();
  }

  checkout() {
    this.showModal = true;
  }

  confirmOrder() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.showModal = false;
    alert('Your order is on the way!');
  }
}
