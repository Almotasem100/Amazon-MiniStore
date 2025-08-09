import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public toast: ToastService) {}
  currentYear = new Date().getFullYear();
}
