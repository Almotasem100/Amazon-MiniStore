import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwt_token';
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  signIn(credentials: { usernameOrEmail: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/signin`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('email', res.email);
        }
      })
    );
  }

  signUp(user: any) {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
