import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './data.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock initial user
  private readonly defaultUser: User = {
    id: 'u-1',
    email: 'payhub@dapplesoft.com',
    passwordHash: 'payhub123', // In real app, this would be bcrypt
    role: 'Admin',
    name: 'Super Admin'
  };

  currentUser = signal<User | null>(null);

  constructor(private router: Router) {
    // Try to load from local storage
    const stored = localStorage.getItem('payhub_user');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  login(email: string, pass: string): boolean {
    // Simple mock authentication
    if (email === this.defaultUser.email && pass === 'payhub123') {
      this.currentUser.set(this.defaultUser);
      localStorage.setItem('payhub_user', JSON.stringify(this.defaultUser));
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('payhub_user');
    this.router.navigate(['/login']);
  }

  isAdmin = computed(() => this.currentUser()?.role === 'Admin');
}