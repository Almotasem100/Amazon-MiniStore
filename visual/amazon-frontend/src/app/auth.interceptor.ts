import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt_token');
    console.log('[AuthInterceptor] Token:', token, 'URL:', request.url);
    if (token && !request.url.endsWith('/signin') && !request.url.endsWith('/signup')) {
        request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
        });
        console.log('[AuthInterceptor] Added Authorization header:', request.headers.get('Authorization'));
    }
    return next.handle(request);
    }
}
