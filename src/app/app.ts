import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  // templateUrl: './app.html',
  // styleUrl: './app.css'
  templateUrl: './pages/dashboard/dashboard.component.html',
  styleUrl: './pages/dashboard/dashboard.component.css'
})
export class App {
  protected readonly title = signal('Projet MEAN');
}
