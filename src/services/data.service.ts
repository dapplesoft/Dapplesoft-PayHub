import { Injectable, signal, computed } from '@angular/core';
import { Gateway, Project, Transaction, User, Financial, Payout } from './data.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Signals acting as database tables
  gateways = signal<Gateway[]>([]);
  projects = signal<Project[]>([]);
  transactions = signal<Transaction[]>([]);
  users = signal<User[]>([]);
  payouts = signal<Payout[]>([]);

  // Computed Financials
  financials = computed<Financial[]>(() => {
    const txs = this.transactions();
    const projs = this.projects();
    const allPayouts = this.payouts();
    
    return projs.map(p => {
      const projectTxs = txs.filter(t => t.project_id === p.id && t.status === 'Success');
      const totalEarned = projectTxs.reduce((sum, t) => sum + t.amount, 0);
      
      const projectPayouts = allPayouts.filter(po => po.project_id === p.id);
      const released = projectPayouts.reduce((sum, po) => sum + po.amount, 0);
      
      return {
        project_id: p.id,
        project_name: p.name,
        total_earned: totalEarned,
        released_amount: released,
        balance: totalEarned - released
      };
    });
  });

  activeGateway = computed(() => this.gateways().find(g => g.active));
  currencySymbol = computed(() => {
    const gw = this.activeGateway();
    return gw?.currency === 'BDT' ? '৳' : '$';
  });

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial data if empty
    if (this.gateways().length === 0) {
      this.gateways.set([
        {
          id: 'g-1',
          name: 'SSLCommerz',
          store_id: 'dapple_live',
          prefix: 'DPL',
          secret_key: 'zxczxczxc',
          payment_url: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
          verify_url: 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
          ipn_url: 'https://api.dapplesoft.com/ipn/ssl',
          currency: 'BDT',
          mode: 'Sandbox',
          active: true
        },
        {
          id: 'g-2',
          name: 'ShurjoPay',
          store_id: 'sp_sandbox_001',
          prefix: 'NOK',
          secret_key: 'shurjo_secret_key',
          payment_url: 'https://sandbox.shurjopayment.com/api/get_token',
          verify_url: 'https://sandbox.shurjopayment.com/api/verification',
          ipn_url: 'https://api.dapplesoft.com/ipn/shurjo',
          currency: 'BDT',
          mode: 'Sandbox',
          active: false
        }
      ]);
    }

    if (this.projects().length === 0) {
      this.projects.set([
        {
          id: 'p-1',
          name: 'E-Commerce Store',
          api_key: '550e8400-e29b-41d4-a716-446655440000',
          client_id: 'client-123',
          secret_key: 'sk_live_init_123456'
        }
      ]);
    }

    if (this.payouts().length === 0) {
      this.payouts.set([
        {
          id: 'po-1',
          project_id: 'p-1',
          amount: 100,
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          status: 'Processed'
        }
      ]);
    }

    if (this.transactions().length === 0) {
      this.transactions.set([
        {
          id: 't-1',
          project_id: 'p-1',
          amount: 500,
          transaction_id: 'TXN-1001',
          status: 'Success',
          date: new Date().toISOString(),
          customer_email: 'customer.one@example.com',
          payment_method: 'VISA •••• 4242',
          logs: [
            '2023-10-25 10:00:00 - Transaction initialized',
            '2023-10-25 10:00:05 - User redirected to gateway',
            '2023-10-25 10:02:30 - Payment authorized by gateway',
            '2023-10-25 10:02:31 - IPN received: VALID',
            '2023-10-25 10:02:31 - Status updated to Success'
          ]
        },
        {
          id: 't-2',
          project_id: 'p-1',
          amount: 1200,
          transaction_id: 'TXN-1002',
          status: 'Pending',
          date: new Date().toISOString(),
          customer_email: 'buyer.two@test.com',
          payment_method: 'BKASH',
          logs: [
            '2023-10-26 14:15:00 - Transaction initialized',
            '2023-10-26 14:15:10 - User redirected to gateway',
            '2023-10-26 14:15:15 - Waiting for user input'
          ]
        }
      ]);
    }
  }

  // --- CRUD METHODS ---

  // Gateway
  addGateway(gw: Omit<Gateway, 'id'>) {
    const newGw = { ...gw, id: crypto.randomUUID() };
    if (newGw.active) {
      // Deactivate others
      this.gateways.update(gs => gs.map(g => ({ ...g, active: false })));
    }
    this.gateways.update(gs => [...gs, newGw]);
  }

  deleteGateway(id: string) {
    this.gateways.update(gs => gs.filter(g => g.id !== id));
  }

  toggleGatewayActive(id: string) {
    this.gateways.update(gs => gs.map(g => ({
      ...g,
      active: g.id === id
    })));
  }

  // Projects
  addProject(name: string) {
    // Generate a secure 64-character hex secret key
    const secret_key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      api_key: crypto.randomUUID(),
      client_id: 'cid_' + crypto.randomUUID().split('-')[0],
      secret_key: 'sk_' + secret_key
    };
    this.projects.update(ps => [...ps, newProject]);
  }

  updateProject(id: string, data: Partial<Project>) {
    this.projects.update(ps => ps.map(p => 
      p.id === id ? { ...p, ...data } : p
    ));
  }

  deleteProject(id: string) {
    this.projects.update(ps => ps.filter(p => p.id !== id));
  }

  // Transactions
  addTransaction(t: Omit<Transaction, 'id' | 'date'>) {
    const newTx: Transaction = {
      ...t,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      logs: [`${new Date().toISOString()} - Transaction created manually`]
    };
    this.transactions.update(ts => [newTx, ...ts]);
  }

  deleteTransaction(id: string) {
    this.transactions.update(ts => ts.filter(t => t.id !== id));
  }

  // Payouts
  addPayout(projectId: string, amount: number) {
    const newPayout: Payout = {
      id: crypto.randomUUID(),
      project_id: projectId,
      amount: amount,
      date: new Date().toISOString(),
      status: 'Processed'
    };
    this.payouts.update(ps => [...ps, newPayout]);
  }

  // Users
  addUser(u: Omit<User, 'id'>) {
    const newUser = { ...u, id: crypto.randomUUID() };
    this.users.update(us => [...us, newUser]);
  }
  
  deleteUser(id: string) {
    this.users.update(us => us.filter(u => u.id !== id));
  }
}