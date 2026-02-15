import { Component, inject, signal, computed } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Transaction } from '../services/data.models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
           <h2 class="text-2xl font-bold text-slate-900">Transactions</h2>
           <p class="text-slate-500 text-sm mt-1">Real-time payment monitoring.</p>
         </div>
         <div class="flex space-x-2">
            <button class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium shadow-sm transition-colors">Export CSV</button>
         </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200" [formGroup]="filterForm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Client Project</label>
            <select formControlName="project" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50">
              <option value="All">All Projects</option>
              @for (p of data.projects(); track p.id) {
                <option [value]="p.id">{{ p.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
            <select formControlName="status" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50">
              <option value="All">All Statuses</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
            <input type="date" formControlName="startDate" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50">
          </div>
          <div>
            <button (click)="resetFilters()" class="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
             <thead class="bg-slate-50 border-b border-slate-200 uppercase text-slate-500 text-xs font-semibold">
              <tr>
                <th class="px-6 py-4">Date</th>
                <th class="px-6 py-4">Transaction ID</th>
                <th class="px-6 py-4">Project</th>
                <th class="px-6 py-4">Amount</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
               @for (tx of filteredTransactions(); track tx.id) {
                 <tr (click)="viewDetails(tx)" class="hover:bg-slate-50 transition-colors cursor-pointer group">
                   <td class="px-6 py-4 text-slate-600 whitespace-nowrap">{{ tx.date | date:'short' }}</td>
                   <td class="px-6 py-4 font-mono text-slate-600 text-xs">{{ tx.transaction_id }}</td>
                   <td class="px-6 py-4 text-slate-800 font-medium">{{ getProjectName(tx.project_id) }}</td>
                   <td class="px-6 py-4 font-bold text-slate-800">{{ currency() }}{{ tx.amount | number:'1.2-2' }}</td>
                   <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 rounded-full text-xs font-medium ' + getStatusClass(tx.status)">
                        {{ tx.status }}
                      </span>
                   </td>
                   <td class="px-6 py-4 text-right">
                     <button (click)="$event.stopPropagation(); viewDetails(tx)" class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-transparent hover:border-blue-100">
                       View
                     </button>
                   </td>
                 </tr>
               }
               @if (filteredTransactions().length === 0) {
                 <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                      No transactions found matching your criteria.
                    </td>
                 </tr>
               }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    @if (selectedTx(); as tx) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up transform transition-all" (click)="$event.stopPropagation()">
           <!-- Header -->
           <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div class="flex items-center space-x-3">
               <div class="bg-blue-100 p-2 rounded-lg text-blue-600">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
               </div>
               <div>
                 <h3 class="font-bold text-lg text-slate-800">Transaction Details</h3>
                 <p class="text-xs text-slate-500 font-mono">{{ tx.transaction_id }}</p>
               </div>
             </div>
             <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-colors">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
           </div>
           
           <!-- Body -->
           <div class="p-6">
              <!-- Key Stats -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Amount</span>
                  <span class="block text-lg font-bold text-slate-900">{{ currency() }}{{ tx.amount | number:'1.2-2' }}</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                  <span [class]="'inline-block px-2 py-0.5 rounded text-xs font-bold ' + getStatusClass(tx.status)">{{ tx.status }}</span>
                </div>
                 <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2">
                  <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</span>
                  <span class="block text-sm font-medium text-slate-700">{{ tx.date | date:'medium' }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Information</h4>
                    <div class="space-y-3">
                       <div class="flex justify-between border-b border-slate-100 pb-2">
                         <span class="text-sm text-slate-500">Email</span>
                         <span class="text-sm font-medium text-slate-800">{{ tx.customer_email || 'N/A' }}</span>
                       </div>
                       <div class="flex justify-between border-b border-slate-100 pb-2">
                         <span class="text-sm text-slate-500">Project</span>
                         <span class="text-sm font-medium text-slate-800">{{ getProjectName(tx.project_id) }}</span>
                       </div>
                    </div>
                 </div>
                 <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Information</h4>
                    <div class="space-y-3">
                       <div class="flex justify-between border-b border-slate-100 pb-2">
                         <span class="text-sm text-slate-500">Method</span>
                         <span class="text-sm font-medium text-slate-800">{{ tx.payment_method || 'N/A' }}</span>
                       </div>
                       <div class="flex justify-between border-b border-slate-100 pb-2">
                         <span class="text-sm text-slate-500">Gateway ID</span>
                         <span class="text-sm font-medium text-slate-800 font-mono text-xs">{{ tx.id.substring(0,8) }}...</span>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Activity Logs</h4>
                <div class="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
                  @for (log of tx.logs; track $index) {
                    <div class="flex gap-3">
                      <span class="text-slate-500 select-none">{{ $index + 1 }}.</span>
                      <span>{{ log }}</span>
                    </div>
                  }
                  @if (!tx.logs || tx.logs.length === 0) {
                    <span class="text-slate-500 italic">No logs available for this transaction.</span>
                  }
                </div>
              </div>
           </div>
           
           <!-- Footer -->
           <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button (click)="closeModal()" class="px-4 py-2 bg-[#1E40AF] text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm">
                Close
              </button>
           </div>
        </div>
      </div>
    }
  `
})
export class TransactionsComponent {
  data = inject(DataService);
  auth = inject(AuthService);
  fb = inject(FormBuilder);
  
  currency = this.data.currencySymbol;
  
  // State for selected transaction modal
  selectedTx = signal<Transaction | null>(null);

  filterForm = this.fb.group({
    project: ['All'],
    status: ['All'],
    startDate: [''],
    endDate: ['']
  });

  filters = signal({ project: 'All', status: 'All', startDate: '', endDate: '' });

  filteredTransactions = computed(() => {
    const txs = this.data.transactions();
    const f = this.filters();

    return txs.filter(tx => {
      // Project
      if (f.project !== 'All' && tx.project_id !== f.project) {
        return false;
      }

      // Status
      if (f.status !== 'All' && tx.status !== f.status) {
        return false;
      }
      
      const txDate = new Date(tx.date).getTime();

      // Start Date
      if (f.startDate) {
        const start = new Date(f.startDate).getTime();
        if (txDate < start) return false;
      }

      // End Date
      if (f.endDate) {
        const end = new Date(f.endDate);
        const endTime = end.getTime() + 86400000; 
        if (txDate >= endTime) return false;
      }

      return true;
    });
  });

  constructor() {
    this.filterForm.valueChanges.subscribe(val => {
      this.filters.set({
        project: val.project || 'All',
        status: val.status || 'All',
        startDate: val.startDate || '',
        endDate: val.endDate || ''
      });
    });
  }

  viewDetails(tx: Transaction) {
    this.selectedTx.set(tx);
  }

  closeModal() {
    this.selectedTx.set(null);
  }

  resetFilters() {
    this.filterForm.reset({
      project: 'All',
      status: 'All',
      startDate: '',
      endDate: ''
    });
  }

  getProjectName(id: string): string {
    return this.data.projects().find(p => p.id === id)?.name || 'Unknown Project';
  }

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