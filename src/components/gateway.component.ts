import { Component, inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Gateway, Currency, Mode } from '../services/data.models';

@Component({
  selector: 'app-gateway',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <div>
           <h2 class="text-2xl font-bold text-slate-900">Gateway Configuration</h2>
           <p class="text-slate-500 text-sm mt-1">Manage payment processors. Only one active at a time.</p>
        </div>
        <button (click)="showForm = !showForm" class="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          {{ showForm ? 'Cancel' : '+ Add Gateway' }}
        </button>
      </div>

      @if (showForm) {
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in-down">
          
          <!-- Presets -->
          <div class="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
             <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Fill from Provider</label>
             <div class="flex flex-wrap gap-2">
               <button type="button" (click)="loadPreset('ssl_sandbox')" class="px-3 py-1.5 bg-white border border-slate-300 shadow-sm rounded text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                 SSLCommerz (Sandbox)
               </button>
               <button type="button" (click)="loadPreset('shurjo_sandbox')" class="px-3 py-1.5 bg-white border border-slate-300 shadow-sm rounded text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                 ShurjoPay (Sandbox)
               </button>
               <button type="button" (click)="loadPreset('shurjo_live')" class="px-3 py-1.5 bg-white border border-slate-300 shadow-sm rounded text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                 ShurjoPay (Live)
               </button>
             </div>
          </div>

          <form [formGroup]="gwForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div class="col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Gateway Name</label>
              <input formControlName="name" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Store ID / Username</label>
              <input formControlName="store_id" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>

            <div class="col-span-1">
               <label class="block text-sm font-medium text-slate-700 mb-1">Prefix</label>
               <input formControlName="prefix" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>

            <div class="col-span-1">
               <label class="block text-sm font-medium text-slate-700 mb-1">Secret Key / Password</label>
               <input formControlName="secret_key" type="password" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Payment URL (Token API)</label>
              <input formControlName="payment_url" type="url" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>
            
            <div class="col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Verify URL</label>
              <input formControlName="verify_url" type="url" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>
             
            <div class="col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">IPN URL</label>
              <input formControlName="ipn_url" type="url" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Currency</label>
              <select formControlName="currency" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-slate-700 mb-1">Mode</label>
              <select formControlName="mode" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="Sandbox">Sandbox</option>
                <option value="Live">Live</option>
              </select>
            </div>
            
            <div class="col-span-2 flex items-center space-x-2">
               <input formControlName="active" type="checkbox" id="active" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
               <label for="active" class="text-sm text-slate-700 font-medium">Set as Active Gateway</label>
            </div>

            <div class="col-span-2 flex justify-end">
               <button type="submit" [disabled]="gwForm.invalid" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                 Save Configuration
               </button>
            </div>
          </form>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (gw of data.gateways(); track gw.id) {
          <div class="relative bg-white rounded-xl border shadow-sm transition-all hover:shadow-md" 
               [class.border-emerald-500]="gw.active" 
               [class.ring-2]="gw.active"
               [class.ring-emerald-500]="gw.active"
               [class.border-slate-200]="!gw.active">
            
            @if (gw.active) {
              <div class="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                ACTIVE
              </div>
            }

            <div class="p-6">
              <div class="flex items-center space-x-3 mb-4">
                 <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                    <img *ngIf="gw.name.toLowerCase().includes('shurjo')" src="https://shurjopay.com.bd/wp-content/uploads/2019/12/shurjopay-logo-2.png" alt="SP" class="w-full h-full object-cover">
                    <span *ngIf="!gw.name.toLowerCase().includes('shurjo')">{{ gw.name.charAt(0) }}</span>
                 </div>
                 <h3 class="font-bold text-lg text-slate-800">{{ gw.name }}</h3>
              </div>
              
              <div class="space-y-2 text-sm text-slate-600 mb-6">
                <div class="flex justify-between"><span>Currency:</span> <span class="font-medium">{{ gw.currency }}</span></div>
                <div class="flex justify-between"><span>Mode:</span> <span class="font-medium px-2 py-0.5 rounded text-xs" [ngClass]="gw.mode === 'Live' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'">{{ gw.mode }}</span></div>
                <div class="flex justify-between"><span>ID:</span> <span class="font-mono truncate w-32 text-right">{{ gw.store_id }}</span></div>
              </div>

              <div class="flex space-x-2 mt-4 pt-4 border-t border-slate-100">
                @if (!gw.active) {
                   <button (click)="data.toggleGatewayActive(gw.id)" class="flex-1 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                     Make Active
                   </button>
                }
                <button (click)="data.deleteGateway(gw.id)" class="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class GatewayComponent {
  data = inject(DataService);
  fb = inject(FormBuilder);
  showForm = false;

  gwForm = this.fb.group({
    name: ['', Validators.required],
    store_id: ['', Validators.required],
    prefix: ['', Validators.required],
    secret_key: ['', Validators.required],
    payment_url: ['', Validators.required],
    verify_url: ['', Validators.required],
    ipn_url: ['', Validators.required],
    currency: ['BDT' as Currency, Validators.required],
    mode: ['Sandbox' as Mode, Validators.required],
    active: [false]
  });

  loadPreset(type: string) {
    if (type === 'ssl_sandbox') {
      this.gwForm.patchValue({
        name: 'SSLCommerz',
        payment_url: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
        verify_url: 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
        ipn_url: 'https://api.dapplesoft.com/ipn/ssl',
        mode: 'Sandbox',
        currency: 'BDT'
      });
    } else if (type === 'shurjo_sandbox') {
      this.gwForm.patchValue({
        name: 'ShurjoPay',
        payment_url: 'https://sandbox.shurjopayment.com/api/get_token',
        verify_url: 'https://sandbox.shurjopayment.com/api/verification',
        ipn_url: 'https://api.dapplesoft.com/ipn/shurjo',
        mode: 'Sandbox',
        currency: 'BDT'
      });
    }
     else if (type === 'shurjo_live') {
      this.gwForm.patchValue({
        name: 'ShurjoPay',
        payment_url: 'https://engine.shurjopayment.com/api/get_token',
        verify_url: 'https://engine.shurjopayment.com/api/verification',
        ipn_url: 'https://api.dapplesoft.com/ipn/shurjo',
        mode: 'Live',
        currency: 'BDT'
      });
    }
  }

  onSubmit() {
    if (this.gwForm.valid) {
      this.data.addGateway(this.gwForm.value as any);
      this.showForm = false;
      this.gwForm.reset({ currency: 'BDT', mode: 'Sandbox', active: false });
    }
  }
}