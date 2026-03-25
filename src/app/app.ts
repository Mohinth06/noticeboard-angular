import { Component, OnInit, signal } from '@angular/core';

// API base URL — overridden by window.__API_BASE__ in production index.html
// or set to localhost:3000 for local dev
const API_BASE = (window as any).__API_BASE__ || 'http://localhost:3000';
import { HttpClient } from '@angular/common/http';
import { CommonModule, UpperCasePipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  // ============================================
  // Angular Pipes — imported here for standalone component
  // WHY: Pipes transform display values in templates.
  //      (uppercase, date, titlecase are built-in Angular pipes)
  // HOW: Add to imports[], then use {{ value | pipeName }} in HTML
  // ============================================
  imports: [CommonModule, UpperCasePipe, DatePipe, TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Separate Angular Notice Board';
  notices = signal<any[]>([]);
  loading = signal(true);
  today = new Date(); // Used in pipes demo: {{ today | date }}, {{ today | date:'fullDate' }}

  // EJS Demo data fetched from Express /api/dynamic
  ejsData = signal<any>(null);
  ejsLoading = signal(true);
  showEjsDemo = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch notices from Node Server
    this.http.get<any[]>(`${API_BASE}/api/notices`).subscribe({
      next: (data) => {
        this.notices.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching notices', err);
        this.loading.set(false);
      }
    });

    // Fetch EJS dynamic data from Express JSON API
    this.http.get<any>(`${API_BASE}/api/dynamic`).subscribe({
      next: (data) => {
        this.ejsData.set(data);
        this.ejsLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching EJS data', err);
        this.ejsLoading.set(false);
      }
    });
  }

  toggleEjsDemo() {
    this.showEjsDemo.set(!this.showEjsDemo());
  }
}
