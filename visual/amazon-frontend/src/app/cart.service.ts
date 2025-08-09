import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  quantity?: number;
  category?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cart_items';
  private items: CartItem[] = [];

  // expose count for header badge
  readonly count$ = new BehaviorSubject<number>(0);

  constructor() {
    this.items = this.load();
    this.count$.next(this.computeCount());
  }

  addToCart(product: Product, qty = 1) {
    const found = this.items.find((i) => i.product.id === product.id);
    if (found) {
      found.quantity += qty;
    } else {
      this.items.push({ product, quantity: qty });
    }
    this.persist();
  }

  getCartItems(): CartItem[] {
    // return a copy to avoid outside mutation
    return this.items.map((i) => ({ product: i.product, quantity: i.quantity }));
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter((i) => i.product.id !== productId);
    this.persist();
  }

  clearCart() {
    this.items = [];
    this.persist();
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  getTotalWithDelivery(delivery: number): number {
    return this.getTotalPrice() + delivery;
  }

  getCount(): number {
    return this.computeCount();
  }

  // helpers
  private computeCount() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  private persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.count$.next(this.computeCount());
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
