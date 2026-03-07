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
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          
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
            <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">End Date</label>
            <input type="date" formControlName="endDate" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50">
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
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md" (click)="closeModal()">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up transform transition-all" (click)="$event.stopPropagation()">
           <!-- Header -->
           <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
             <div class="flex items-center space-x-4">
               <div [class]="'p-3 rounded-2xl ' + getStatusClass(tx.status).replace('text-', 'bg-').replace('800', '100') + ' ' + getStatusClass(tx.status).split(' ')[1]">
                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
               </div>
               <div>
                 <div class="flex items-center gap-2">
                   <h3 class="font-bold text-xl text-slate-900">Transaction Details</h3>
                   <span [class]="'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ' + getStatusClass(tx.status)">
                     {{ tx.status }}
                   </span>
                 </div>
                 <div class="flex items-center mt-1 group">
                   <p class="text-xs text-slate-400 font-mono tracking-tight">{{ tx.transaction_id }}</p>
                   <button (click)="copyId(tx.transaction_id)" class="ml-2 text-slate-300 hover:text-blue-500 transition-colors">
                     @if (copiedId()) {
                       <span class="text-[10px] font-bold text-emerald-500">Copied!</span>
                     } @else {
                       <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                     }
                   </button>
                 </div>
               </div>
             </div>
             <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-colors">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
           </div>
           
           <!-- Body -->
           <div class="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <!-- Grid Layout -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <!-- Left Column: Info -->
                <div class="md:col-span-2 space-y-8">
                  
                  <!-- Amount Display -->
                  <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Total Amount</span>
                      <div class="flex items-baseline gap-1 mt-1">
                        <span class="text-2xl font-bold text-slate-900">{{ currency() }}</span>
                        <span class="text-4xl font-black text-slate-900 tracking-tight">{{ tx.amount | number:'1.2-2' }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Date & Time</span>
                      <p class="text-sm font-semibold text-slate-700 mt-1">{{ tx.date | date:'MMM d, y' }}</p>
                      <p class="text-xs text-slate-400">{{ tx.date | date:'h:mm a' }}</p>
                    </div>
                  </div>

                  <!-- Details Sections -->
                  <div class="grid grid-cols-2 gap-8">
                    <div>
                      <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Customer</h4>
                      <div class="space-y-4">
                        <div class="flex flex-col">
                          <span class="text-xs text-slate-400 mb-0.5">Email Address</span>
                          <span class="text-sm font-semibold text-slate-800 truncate">{{ tx.customer_email || 'Not provided' }}</span>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-xs text-slate-400 mb-0.5">Project</span>
                          <span class="text-sm font-semibold text-slate-800">{{ getProjectName(tx.project_id) }}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">Payment</h4>
                      <div class="space-y-4">
                        <div class="flex flex-col">
                          <span class="text-xs text-slate-400 mb-0.5">Method</span>
                          <div class="flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span class="text-sm font-semibold text-slate-800">{{ tx.payment_method || 'Unknown' }}</span>
                          </div>
                        </div>
                        <div class="flex flex-col">
                          <span class="text-xs text-slate-400 mb-0.5">Internal ID</span>
                          <span class="text-xs font-mono text-slate-500">{{ tx.id }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Notes -->
                  @if (tx.notes) {
                    <div class="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/50">
                       <h4 class="text-[10px] font-bold text-amber-600 uppercase tracking-[0.1em] mb-2 flex items-center gap-2">
                         <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                         Internal Notes
                       </h4>
                       <p class="text-sm text-amber-900 leading-relaxed font-medium">
                         {{ tx.notes }}
                       </p>
                    </div>
                  }
                </div>

                <!-- Right Column: Timeline -->
                <div class="border-l border-slate-100 pl-8">
                  <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-6">Activity Timeline</h4>
                  <div class="space-y-8 relative">
                    <!-- Vertical Line -->
                    <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                    
                    @for (log of tx.logs; track $index) {
                      <div class="relative pl-8 group">
                        <!-- Dot -->
                        <div class="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white bg-slate-200 shadow-sm group-hover:scale-110 transition-transform z-10"
                             [class.bg-blue-500]="log.actor === 'Gateway'"
                             [class.bg-emerald-500]="log.message.includes('Success') || log.message.includes('VALID')"
                             [class.bg-amber-500]="log.actor === 'System' && !log.message.includes('VALID')">
                        </div>
                        
                        <div>
                          <p class="text-xs font-bold text-slate-800 leading-tight">{{ log.message }}</p>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-[10px] text-slate-400 font-medium">{{ log.timestamp | date:'h:mm:ss a' }}</span>
                            <span class="text-[10px] text-slate-300">•</span>
                            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{{ log.actor }}</span>
                          </div>
                        </div>
                      </div>
                    }
                    @if (!tx.logs || tx.logs.length === 0) {
                      <div class="text-center py-8">
                        <p class="text-xs text-slate-400 italic">No activity logs recorded.</p>
                      </div>
                    }
                  </div>
                </div>

              </div>
           </div>
           
           <!-- Footer -->
           <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button (click)="closeModal()" class="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
                Dismiss
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
  copiedId = signal(false);

  copyId(id: string) {
    navigator.clipboard.writeText(id).then(() => {
      this.copiedId.set(true);
      setTimeout(() => this.copiedId.set(false), 2000);
    });
  }

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