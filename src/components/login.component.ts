import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-200">
        <div class="text-center">
          <h1 class="text-4xl font-extrabold text-[#1E40AF] tracking-tight mb-2">Dapplesoft PayHub</h1>
          <h2 class="text-lg font-medium text-slate-600">Admin Portal Access</h2>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div class="space-y-4 rounded-md">
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email" 
                class="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow" 
                placeholder="payhub@dapplesoft.com">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password" 
                class="appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow" 
                placeholder="••••••••">
            </div>
          </div>

          @if (error) {
            <div class="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {{ error }}
            </div>
          }

          <div>
            <button 
              type="submit" 
              [disabled]="loginForm.invalid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1E40AF] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all">
              Sign in securely
            </button>
          </div>
          
          <div class="text-center text-xs text-slate-400 mt-4">
            Authorized personnel only. Dapplesoft Inc.
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  
  error = '';
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (!this.auth.login(email!, password!)) {
        this.error = 'Invalid credentials. Try payhub@dapplesoft.com / payhub123';
      }
    }
  }
}