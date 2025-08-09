import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  user = { username: '', email: '', password: '', gender: '', country: '', phone: '', address: '' };
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  signUp() {
    this.auth.signUp(this.user).subscribe({
      next: () => {
        this.success = "Registered! Please sign in.";
        setTimeout(() => this.router.navigate(['/signin']), 1500);
      },
      error: err => this.error = err.error?.error || 'Sign up failed'
    });
  }
}
