import { Component, inject, signal } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project } from '../services/data.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="space-y-8">
      <div class="flex justify-between items-center">
        <div>
           <h2 class="text-2xl font-bold text-slate-900">Client Projects</h2>
           <p class="text-slate-500 text-sm mt-1">Manage API integrations and connection secrets.</p>
        </div>
        <button (click)="showForm = !showForm" class="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          {{ showForm ? 'Cancel' : '+ New Project' }}
        </button>
      </div>

      <!-- Create New Project Form -->
      @if (showForm) {
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 animate-fade-in-down">
          <h3 class="text-lg font-bold text-slate-800 mb-4">Create New Project</h3>
          <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-1 w-full">
              <label class="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
              <input formControlName="name" type="text" placeholder="e.g. My E-commerce Site" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            </div>
            <button type="submit" [disabled]="projectForm.invalid" class="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              Generate Keys
            </button>
          </form>
        </div>
      }

      <!-- Project List -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 border-b border-slate-200 uppercase text-slate-500 text-xs font-semibold">
              <tr>
                <th class="px-6 py-4">Project Name</th>
                <th class="px-6 py-4">Client ID</th>
                <th class="px-6 py-4">Project ID</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (p of data.projects(); track p.id) {
                <tr (click)="openEditModal(p)" class="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td class="px-6 py-4 font-medium text-slate-900">{{ p.name }}</td>
                  <td class="px-6 py-4 font-mono text-slate-500 text-xs">{{ p.client_id }}</td>
                  <td class="px-6 py-4 font-mono text-slate-500 text-xs text-slate-400">
                     {{ p.id }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="$event.stopPropagation(); openEditModal(p)" class="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded text-xs font-medium transition-colors mr-2">
                      View & Edit
                    </button>
                    <button (click)="$event.stopPropagation(); data.deleteProject(p.id)" class="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded text-xs font-medium transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              }
              @if (data.projects().length === 0) {
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-slate-400">No projects found. Create one to get started.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit/View Modal -->
    @if (selectedProject()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" (click)="closeEditModal()">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up" (click)="$event.stopPropagation()">
           <!-- Header -->
           <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div class="flex items-center space-x-3">
               <div class="bg-purple-100 p-2 rounded-lg text-purple-600">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
               </div>
               <div>
                 <h3 class="font-bold text-lg text-slate-800">Connection Details</h3>
                 <p class="text-xs text-slate-500">Copy these credentials to your application.</p>
               </div>
             </div>
             <button (click)="closeEditModal()" class="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full p-1 transition-colors">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
           </div>
           
           <!-- Body -->
           <div class="p-6 space-y-6">
              
              <!-- Editable Name -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Project Name</label>
                <input [formControl]="editNameControl" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
              </div>

              <!-- Readonly Copyable Fields -->
              <div class="space-y-4">
                 
                 <!-- Project ID -->
                 <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div class="flex justify-between items-center mb-1">
                      <label class="text-xs font-semibold text-slate-500 uppercase">Project ID</label>
                      <button (click)="copyToClipboard(selectedProject()!.id, 'pid')" class="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center">
                        {{ copiedField() === 'pid' ? 'Copied!' : 'Copy ID' }}
                        <svg *ngIf="copiedField() !== 'pid'" class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      </button>
                    </div>
                    <code class="block font-mono text-sm text-slate-800 break-all bg-white p-2 rounded border border-slate-100">{{ selectedProject()!.id }}</code>
                 </div>

                 <!-- Client ID -->
                 <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div class="flex justify-between items-center mb-1">
                      <label class="text-xs font-semibold text-slate-500 uppercase">Client ID</label>
                      <button (click)="copyToClipboard(selectedProject()!.client_id, 'cid')" class="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center">
                        {{ copiedField() === 'cid' ? 'Copied!' : 'Copy Client ID' }}
                        <svg *ngIf="copiedField() !== 'cid'" class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      </button>
                    </div>
                    <code class="block font-mono text-sm text-slate-800 break-all bg-white p-2 rounded border border-slate-100">{{ selectedProject()!.client_id }}</code>
                 </div>

                 <!-- Secret -->
                 <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div class="flex justify-between items-center mb-1">
                      <label class="text-xs font-semibold text-slate-500 uppercase">Secret Key</label>
                      <button (click)="copyToClipboard(selectedProject()!.secret_key, 'sec')" class="text-xs font-medium text-red-600 hover:text-red-800 flex items-center">
                        {{ copiedField() === 'sec' ? 'Copied!' : 'Copy Secret' }}
                        <svg *ngIf="copiedField() !== 'sec'" class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      </button>
                    </div>
                    <div class="relative group">
                       <code class="block font-mono text-sm text-slate-800 break-all bg-white p-2 rounded border border-slate-100 blur-sm group-hover:blur-none transition-all duration-300 select-all">{{ selectedProject()!.secret_key }}</code>
                       <div class="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                         <span class="text-xs text-slate-400 font-medium">Hover to reveal</span>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
           
           <!-- Footer -->
           <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button (click)="closeEditModal()" class="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button (click)="saveChanges()" class="px-4 py-2 bg-[#1E40AF] text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm">
                Save Changes
              </button>
           </div>
        </div>
      </div>
    }
  `
})
export class ProjectsComponent {
  data = inject(DataService);
  fb = inject(FormBuilder);
  
  showForm = false;
  selectedProject = signal<Project | null>(null);
  copiedField = signal<string | null>(null);

  // Form for creating new project
  projectForm = this.fb.group({
    name: ['', Validators.required]
  });

  // Control for editing existing project name
  editNameControl = this.fb.control('', Validators.required);

  onSubmit() {
    if (this.projectForm.valid) {
      this.data.addProject(this.projectForm.value.name!);
      this.showForm = false;
      this.projectForm.reset();
    }
  }

  openEditModal(project: Project) {
    this.selectedProject.set(project);
    this.editNameControl.setValue(project.name);
    this.copiedField.set(null);
  }

  closeEditModal() {
    this.selectedProject.set(null);
  }

  saveChanges() {
    if (this.editNameControl.valid && this.selectedProject()) {
      const id = this.selectedProject()!.id;
      const newName = this.editNameControl.value!;
      
      this.data.updateProject(id, { name: newName });
      this.closeEditModal();
    }
  }

  copyToClipboard(text: string, fieldId: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField.set(fieldId);
      setTimeout(() => {
        // Clear success message after 2 seconds
        if (this.copiedField() === fieldId) {
          this.copiedField.set(null);
        }
      }, 2000);
    });
  }
}