import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { CartDto} from './models/cart.model';
import { CartComponent } from './cart/cart.component';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<CartDto>({ items: [], subtotal: 0, total: 0, delivery: 0 });

  constructor(private http: HttpClient) {}

  /** Get current cart snapshot synchronously */
  getSnapshot(): CartDto {
    return this.cartSubject.value;
  }

  /** Observable for cart changes */
  cart$(): Observable<CartDto> {
    return this.cartSubject.asObservable();
  }

  /** Fetch latest cart from backend */
  fetchCart(): Observable<CartDto> {
    return this.http.get<CartDto>(`${this.apiUrl}`, { headers: this.authHeaders() }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  /** Add item to cart */
  addItem(productId: number, quantity = 1): Observable<CartDto> {
    return this.http.post<CartDto>(`${this.apiUrl}/items`, { productId, quantity }, { headers: this.authHeaders() }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  /** Update quantity of a cart item */
  updateQuantity(rowId: number, quantity: number): Observable<CartDto> {
    return this.http.put<CartDto>(`${this.apiUrl}/items/${rowId}`, { quantity }, { headers: this.authHeaders() }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  /** Remove an item from cart */
  removeItem(rowId: number): Observable<CartDto> {
    return this.http.delete<CartDto>(`${this.apiUrl}/items/${rowId}`, { headers: this.authHeaders() }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  /** Clear the entire cart */
  clear(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`, { headers: this.authHeaders() }).pipe(
      tap(() => this.cartSubject.next({ items: [], subtotal: 0, total: 0, delivery: 0 }))
    );
  }

  /** Checkout */
  checkout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, {}, { headers: this.authHeaders() }).pipe(
      tap(() => this.cartSubject.next({ items: [], subtotal: 0, total: 0, delivery: 0 }))
    );
  }

  /** Get total price + delivery */
  getTotalWithDelivery(delivery: number): number {
    return (this.cartSubject.value.total ?? 0) + delivery;
  }

  /** Helper: build headers with JWT token */
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
}
