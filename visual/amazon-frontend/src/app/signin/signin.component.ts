import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SigninComponent {
  credentials = { usernameOrEmail: '', password: '' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  signIn() {
    this.auth.signIn(this.credentials).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.error = err.error?.error || 'Login failed'
    });
  }
}
