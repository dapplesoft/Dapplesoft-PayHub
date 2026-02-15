import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    @if (auth.currentUser()) {
      <div class="flex h-screen bg-slate-50">
        <!-- Sidebar -->
        <aside class="w-64 bg-[#1E40AF] text-white flex flex-col shadow-xl z-20">
          <div class="p-6 border-b border-blue-800">
            <h1 class="text-2xl font-bold tracking-tight">Dapplesoft <span class="text-[#10B981]">PayHub</span></h1>
            <p class="text-xs text-blue-200 mt-1">Enterprise Payment Gateway</p>
          </div>
          
          <nav class="flex-1 overflow-y-auto py-4">
            <ul class="space-y-1 px-3">
              <li>
                <a routerLink="/dashboard" routerLinkActive="bg-blue-800 text-white" class="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors group">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a routerLink="/gateway" routerLinkActive="bg-blue-800 text-white" class="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Gateway Config
                </a>
              </li>
              <li>
                <a routerLink="/projects" routerLinkActive="bg-blue-800 text-white" class="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                  Client Projects
                </a>
              </li>
              <li>
                <a routerLink="/transactions" routerLinkActive="bg-blue-800 text-white" class="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  Transactions
                </a>
              </li>
              <li>
                <a routerLink="/financial" routerLinkActive="bg-blue-800 text-white" class="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Financial
                </a>
              </li>
              <li>
                <a routerLink="/users" routerLinkActive="bg-blue-800 text-white" class="flex items-center px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  Users
                </a>
              </li>
            </ul>
          </nav>

          <div class="p-4 border-t border-blue-800 bg-blue-900/50">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                {{ auth.currentUser()?.name?.charAt(0) }}
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white">{{ auth.currentUser()?.name }}</p>
                <p class="text-xs text-blue-300">{{ auth.currentUser()?.role }}</p>
              </div>
            </div>
            <button (click)="auth.logout()" class="mt-4 w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-red-300 bg-red-900/20 hover:bg-red-900/40 rounded transition-colors border border-red-900/30">
              Sign Out
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto bg-slate-50 relative">
          <header class="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
            <h2 class="text-xl font-bold text-slate-800">Overview</h2>
            <div class="flex items-center space-x-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                System Operational
              </span>
            </div>
          </header>
          <div class="p-8">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent {
  auth = inject(AuthService);
}