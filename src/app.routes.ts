import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { GatewayComponent } from './components/gateway.component';
import { ProjectsComponent } from './components/projects.component';
import { TransactionsComponent } from './components/transactions.component';
import { FinancialComponent } from './components/financial.component';
import { UsersComponent } from './components/users.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.currentUser()) {
    return true;
  }
  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'gateway', component: GatewayComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'financial', component: FinancialComponent },
      { path: 'users', component: UsersComponent },
    ]
  }
];