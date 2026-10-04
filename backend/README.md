# Hollow Expense Tracker — Backend API

Production-ready REST API built with Node.js, Express, and JWT Authentication.

## Tech Stack
- **Node.js** & **Express**
- **Authentication**: JWT (`jsonwebtoken`) & password hashing with `bcryptjs`
- **Database**: Persistent JSON store with atomic file operations (pluggable with MongoDB)
- **CORS & JSON parsing**: Built-in support for payloads up to 10MB (for receipt attachments)

## Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in and receive JWT token (`email`, `password`)
- `GET /api/auth/me` — Fetch authenticated user details (Protected)
- `PUT /api/auth/profile` — Update user profile & password (Protected)

### Expenses (`/api/expenses`)
- `GET /api/expenses` — List expenses with filters (`category`, `paymentMethod`, `startDate`, `endDate`, `search`, `sortBy`, `sortOrder`)
- `GET /api/expenses/:id` — Get single expense
- `POST /api/expenses` — Create expense (`name`, `amount`, `category`, `date`, `paymentMethod`, `notes`, `receiptUrl`)
- `PUT /api/expenses/:id` — Update expense
- `DELETE /api/expenses/:id` — Delete expense

### Income (`/api/income`)
- `GET /api/income` — List income records with filtering & search
- `GET /api/income/:id` — Get single income record
- `POST /api/income` — Create income (`name`/`source`, `amount`, `category`, `date`, `paymentMethod`, `notes`)
- `PUT /api/income/:id` — Update income
- `DELETE /api/income/:id` — Delete income

### Categories (`/api/categories`)
- `GET /api/categories` — List all categories with computed spending
- `POST /api/categories` — Create category (`name`, `type`, `color`, `icon`)
- `PUT /api/categories/:id` — Update category
- `DELETE /api/categories/:id` — Delete category

### Budgets (`/api/budgets`)
- `GET /api/budgets` — List monthly budgets with live spent & remaining calculations
- `POST /api/budgets` — Create budget (`category`, `monthlyLimit`, `month`, `alertThreshold`)
- `PUT /api/budgets/:id` — Update budget
- `DELETE /api/budgets/:id` — Delete budget

### Reports (`/api/reports`)
- `GET /api/reports` — Generate comprehensive intelligence report (`startDate`, `endDate`, `period`)

## Running Locally

```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.
