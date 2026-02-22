import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  template: '',
})
export class Logout implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (user.role === 'admin' || user.role === 'boutique') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
