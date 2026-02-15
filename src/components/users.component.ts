import { Component, inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="space-y-8">
       <div class="flex justify-between items-center">
         <div>
           <h2 class="text-2xl font-bold text-slate-900">User Management</h2>
           <p class="text-slate-500 text-sm mt-1">Control access to the dashboard.</p>
         </div>
         <button (click)="showForm = !showForm" class="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          {{ showForm ? 'Cancel' : '+ Add User' }}
        </button>
      </div>

      @if (showForm) {
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in-down">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="col-span-1">
               <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
               <input formControlName="name" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
             </div>
             
             <div class="col-span-1">
               <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
               <input formControlName="email" type="email" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
             </div>

             <div class="col-span-1">
               <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
               <select formControlName="role" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                 <option value="Manager">Manager</option>
                 <option value="Admin">Admin</option>
               </select>
             </div>

             <div class="col-span-1">
               <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
               <input formControlName="passwordHash" type="password" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
             </div>

             <div class="col-span-2 flex justify-end">
               <button type="submit" [disabled]="userForm.invalid" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                 Create User
               </button>
             </div>
          </form>
        </div>
      }

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="min-w-full text-left text-sm">
           <thead class="bg-slate-50 border-b border-slate-200 uppercase text-slate-500 text-xs font-semibold">
              <tr>
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">Email</th>
                <th class="px-6 py-4">Role</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <!-- Default Admin Hardcoded for Display if not in list -->
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900 flex items-center">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">S</div>
                  Super Admin
                </td>
                <td class="px-6 py-4 text-slate-600">payhub@dapplesoft.com</td>
                <td class="px-6 py-4"><span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Admin</span></td>
                <td class="px-6 py-4 text-right"><span class="text-slate-400 text-xs italic">System</span></td>
              </tr>

              @for (u of data.users(); track u.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-900 flex items-center">
                    <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold mr-3">{{ u.name.charAt(0) }}</div>
                    {{ u.name }}
                  </td>
                  <td class="px-6 py-4 text-slate-600">{{ u.email }}</td>
                  <td class="px-6 py-4">
                    <span [class]="'px-2 py-1 rounded text-xs font-bold ' + (u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')">
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="data.deleteUser(u.id)" class="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded text-xs font-medium transition-colors">Remove</button>
                  </td>
                </tr>
              }
            </tbody>
        </table>
      </div>
    </div>
  `
})
export class UsersComponent {
  data = inject(DataService);
  fb = inject(FormBuilder);
  showForm = false;

  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    passwordHash: ['', Validators.required],
    role: ['Manager' as const, Validators.required]
  });

  onSubmit() {
    if (this.userForm.valid) {
      this.data.addUser(this.userForm.value as any);
      this.showForm = false;
      this.userForm.reset({ role: 'Manager' });
    }
  }
}