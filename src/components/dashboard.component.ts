import { Component, inject, computed } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Stat Card 1 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Revenue</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ currency() }}{{ totalRevenue() | number:'1.2-2' }}</h3>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg text-blue-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        
        <!-- Stat Card 2 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Active Projects</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ data.projects().length }}</h3>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg text-emerald-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Transactions</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ data.transactions().length }}</h3>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg text-purple-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          </div>
        </div>

        <!-- Stat Card 4 -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Active Gateway</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1 truncate max-w-[120px]" title="{{ activeGatewayName() }}">{{ activeGatewayName() }}</h3>
          </div>
          <div class="p-3 bg-amber-100 rounded-lg text-amber-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-800">Recent Transactions</h3>
          <span class="text-sm text-slate-400">Latest 5 entries</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm whitespace-nowrap">
            <thead class="uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th scope="col" class="px-6 py-4 font-semibold text-slate-500">Txn ID</th>
                <th scope="col" class="px-6 py-4 font-semibold text-slate-500">Date</th>
                <th scope="col" class="px-6 py-4 font-semibold text-slate-500">Amount</th>
                <th scope="col" class="px-6 py-4 font-semibold text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (tx of recentTransactions(); track tx.id) {
                <tr class="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                  <td class="px-6 py-4 font-mono text-slate-600">{{ tx.transaction_id }}</td>
                  <td class="px-6 py-4 text-slate-600">{{ tx.date | date:'medium' }}</td>
                  <td class="px-6 py-4 font-bold text-slate-800">{{ currency() }}{{ tx.amount }}</td>
                  <td class="px-6 py-4">
                    <span [class]="'px-2 py-1 rounded-full text-xs font-medium ' + getStatusClass(tx.status)">
                      {{ tx.status }}
                    </span>
                  </td>
                </tr>
              }
              @if (recentTransactions().length === 0) {
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-slate-400">No transactions recorded yet.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  data = inject(DataService);

  totalRevenue = computed(() => {
    return this.data.financials().reduce((acc, curr) => acc + curr.total_earned, 0);
  });

  currency = this.data.currencySymbol;

  activeGatewayName = computed(() => {
    return this.data.activeGateway()?.name || 'None';
  });

  recentTransactions = computed(() => {
    // Sort by date desc and take top 5
    return [...this.data.transactions()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  getStatusClass(status: string): string {
    switch (status) {
      case 'Success': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  }
}