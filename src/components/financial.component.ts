import { Component, inject, signal, computed } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Financial } from '../services/data.models';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Received</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ currency() }}{{ grandTotals().earned | number:'1.2-2' }}</h3>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg text-blue-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Total Released</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ currency() }}{{ grandTotals().released | number:'1.2-2' }}</h3>
          </div>
          <div class="p-3 bg-emerald-100 rounded-lg text-emerald-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-500">Pending Balance</p>
            <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ currency() }}{{ grandTotals().balance | number:'1.2-2' }}</h3>
          </div>
          <div class="p-3 bg-amber-100 rounded-lg text-amber-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>

      <!-- Controls & Filter -->
      <div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
         <div>
           <h2 class="text-xl font-bold text-slate-900">Project Financials</h2>
           <p class="text-slate-500 text-sm">Manage fund releases per project.</p>
         </div>
         <div class="w-full sm:w-auto">
            <select [formControl]="projectFilter" class="w-full sm:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50">
              <option value="All">All Projects</option>
              @for (p of data.projects(); track p.id) {
                <option [value]="p.id">{{ p.name }}</option>
              }
            </select>
         </div>
      </div>

      <!-- List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (fin of filteredFinancials(); track fin.project_id) {
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between transition-shadow hover:shadow-md">
             <div>
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-bold text-slate-800">{{ fin.project_name }}</h3>
                  <span class="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">ID: {{ fin.project_id.substring(0,8) }}...</span>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mb-6">
                  <div class="text-center p-3 bg-slate-50 rounded-lg">
                    <p class="text-xs text-slate-500 uppercase font-semibold">Earned</p>
                    <p class="text-lg font-bold text-slate-900 mt-1">{{ currency() }}{{ fin.total_earned | number:'1.0-0' }}</p>
                  </div>
                  <div class="text-center p-3 bg-slate-50 rounded-lg">
                    <p class="text-xs text-slate-500 uppercase font-semibold">Released</p>
                    <p class="text-lg font-bold text-slate-600 mt-1">{{ currency() }}{{ fin.released_amount | number:'1.0-0' }}</p>
                  </div>
                  <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p class="text-xs text-blue-600 uppercase font-semibold">Balance</p>
                    <p class="text-lg font-bold text-blue-800 mt-1">{{ currency() }}{{ fin.balance | number:'1.0-0' }}</p>
                  </div>
                </div>
             </div>

             <div class="flex justify-end pt-4 border-t border-slate-100">
               <button (click)="openReleaseModal(fin)" [disabled]="fin.balance <= 0" class="flex items-center space-x-2 bg-[#1E40AF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                 <span>Release Funds</span>
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
               </button>
             </div>
          </div>
        }
        @if (filteredFinancials().length === 0) {
          <div class="col-span-full bg-white p-12 rounded-xl border border-slate-200 text-center">
            <p class="text-slate-400">No projects found matching the criteria.</p>
          </div>
        }
      </div>
    </div>

    <!-- Release Modal -->
    @if (selectedProject(); as proj) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up" (click)="$event.stopPropagation()">
           <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <h3 class="font-bold text-lg text-slate-800">Release Funds</h3>
             <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-colors">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
           </div>
           
           <div class="p-6">
              <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p class="text-sm text-blue-800 font-medium">Available Balance: <span class="font-bold">{{ currency() }}{{ proj.balance | number:'1.2-2' }}</span></p>
                <p class="text-xs text-blue-600 mt-1">Project: {{ proj.project_name }}</p>
              </div>

              <div class="space-y-4">
                 <div>
                   <label class="block text-sm font-medium text-slate-700 mb-1">Amount to Release</label>
                   <div class="relative">
                     <span class="absolute left-3 top-2 text-slate-500">{{ currency() }}</span>
                     <input [formControl]="releaseAmount" type="number" class="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                   </div>
                   @if (releaseAmount.hasError('max')) {
                     <p class="text-xs text-red-500 mt-1">Amount cannot exceed available balance.</p>
                   }
                   @if (releaseAmount.hasError('min')) {
                     <p class="text-xs text-red-500 mt-1">Amount must be greater than 0.</p>
                   }
                 </div>
              </div>
           </div>
           
           <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button (click)="closeModal()" class="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button (click)="confirmRelease()" [disabled]="releaseAmount.invalid" class="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Confirm Release
              </button>
           </div>
        </div>
      </div>
    }
  `
})
export class FinancialComponent {
  data = inject(DataService);
  fb = inject(FormBuilder);
  
  currency = this.data.currencySymbol;
  projectFilter = this.fb.control('All');
  
  selectedProject = signal<Financial | null>(null);
  releaseAmount = this.fb.control(0, [Validators.required, Validators.min(1)]);

  filteredFinancials = computed(() => {
    const all = this.data.financials();
    const filter = this.projectFilter.value;
    
    if (!filter || filter === 'All') {
      return all;
    }
    return all.filter(f => f.project_id === filter);
  });

  grandTotals = computed(() => {
    return this.filteredFinancials().reduce((acc, curr) => {
      return {
        earned: acc.earned + curr.total_earned,
        released: acc.released + curr.released_amount,
        balance: acc.balance + curr.balance
      };
    }, { earned: 0, released: 0, balance: 0 });
  });

  constructor() {
    // React to filter changes
    this.projectFilter.valueChanges.subscribe(() => {
       // Angular signal computed will handle the update automatically
    });
  }

  openReleaseModal(fin: Financial) {
    this.selectedProject.set(fin);
    this.releaseAmount.setValue(0);
    this.releaseAmount.setValidators([Validators.required, Validators.min(1), Validators.max(fin.balance)]);
    this.releaseAmount.updateValueAndValidity();
  }

  closeModal() {
    this.selectedProject.set(null);
  }

  confirmRelease() {
    if (this.releaseAmount.valid && this.selectedProject()) {
      const amount = this.releaseAmount.value!;
      const projId = this.selectedProject()!.project_id;
      
      this.data.addPayout(projId, amount);
      this.closeModal();
    }
  }
}