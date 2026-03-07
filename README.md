# Dapplesoft PayHub - Enterprise Payment Gateway Manager

**Dapplesoft PayHub** is a production-ready, enterprise-grade web application designed to manage payment gateway integrations, monitor transactions, and handle financial payouts for client projects. Built with the latest **Angular (v21)**, it utilizes **Signals**, **Zoneless Change Detection**, and **Tailwind CSS 4.0**.

---

## 🚀 Features

### 1. Dashboard & Analytics
*   **Real-time Overview:** View total revenue, active projects, and transaction counts instantly.
*   **Active Gateway Status:** Monitor which payment processor is currently handling traffic.
*   **Recent Activity:** Quick view of the latest transactions with status indicators.

### 2. Gateway Configuration
*   **Multi-Provider Support:** Pre-configured presets for **SSLCommerz** and **ShurjoPay**.
*   **Environment Toggling:** Seamless switching between **Sandbox** and **Live** modes.
*   **Dynamic Routing:** Activate specific gateways instantly without code changes.

### 3. Client Projects Management
*   **Project Creation:** Create distinct projects for different clients.
*   **Security:** Auto-generation of cryptographic **Client IDs**, **Project IDs**, and **64-character Secret Keys**.
*   **Copy-to-Clipboard:** One-click copy functionality for API credentials.
*   **View & Edit:** Modal interfaces to manage project details securely.

### 4. Transaction Monitoring
*   **Advanced Filtering:** Filter transactions by **Client Project**, **Status** (Success, Pending, Failed, Cancelled), and **Date Range** (Start and End dates).
*   **Improved Detail View:** A modern, "crafted" transaction details modal featuring:
    *   **Activity Timeline:** A vertical, color-coded timeline of all gateway and system events.
    *   **Visual Hierarchy:** Clear separation of customer info, payment methods, and internal IDs.
    *   **Copy ID:** Instant copy functionality for transaction IDs.
*   **Comprehensive Logs:** Audit trails for every step of the payment lifecycle.

### 5. Financial Management
*   **Ledger System:** Automated calculation of Total Earned vs. Released Funds.
*   **Payout Logic:** System to release funds to specific projects with validation logic (cannot release more than the balance).
*   **Grand Totals:** Global view of all assets held and released by the platform.

### 6. User Management
*   **RBAC (Role-Based Access Control):** Distinct roles for **Admins** and **Managers**.
*   **User Administration:** Add and remove dashboard users with real-time updates.

---

## 🛠 Tech Stack & Architecture

*   **Framework:** Angular 21.1.0
*   **State Management:** Angular Signals (Modern, reactive state without complex boilerplate).
*   **Change Detection:** **Zoneless** (High-performance mode using `provideZonelessChangeDetection`).
*   **Styling:** Tailwind CSS 4.0 (Utility-first, modern styling).
*   **Routing:** Hash-based routing for seamless deployment.
*   **Architecture:** Standalone Components (Modular and clean).

---

## 💽 Database & Data Schema

Currently, the application runs on a **Simulated In-Memory Database** provided by `DataService`. In a production backend environment, these would map to the following SQL/NoSQL schemas:

### 1. Gateways Table
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `name` | String | Provider Name |
| `store_id` | String | Gateway Store ID |
| `secret_key` | String | Gateway Password |
| `active` | Boolean | Only one true at a time |

### 2. Projects Table
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `client_id` | String | Public Identifier |
| `secret_key` | String | 64-char Hex Secret (Hashed in DB) |

### 3. Transactions Table
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Internal ID |
| `transaction_id` | String | Public Transaction Ref |
| `project_id` | FK | Links to Projects |
| `amount` | Decimal | Transaction Value |
| `status` | Enum | Pending/Success/Failed/Cancelled |
| `logs` | JSON/Array | Audit trail |

### 4. Payouts Table
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `project_id` | FK | Links to Projects |
| `amount` | Decimal | Amount Released |
| `date` | Timestamp | Date of payout |

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v22 or higher)
*   npm

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/dapplesoft/payhub.git
    cd payhub
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:3000`.

---

## 🔑 Default Access Credentials

Since the auth is currently simulated, use the following credentials to log in:

*   **Email:** `payhub@dapplesoft.com`
*   **Password:** `payhub123`

---

## 🚢 Deployment

1.  Build the project:
    ```bash
    npm run build
    ```
2.  The build artifacts will be stored in the `dist/` directory.
3.  Deploy the contents of `dist/` to any static hosting service (Netlify, Vercel, AWS S3, Apache/Nginx).

---

## License

© 2026 Dapplesoft Inc. All Rights Reserved.
