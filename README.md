# Expense Tracker App

A full-stack web application for tracking personal expenses. Built with React, Express, and PostgreSQL.

---

## Mission Statement

Expense Tracker is built for anyone who wants a simple way to log and understand where their money is going. Whether you're a student budgeting for the month or just someone tired of wondering where your paycheck went — this app gives you a clear, categorized view of your spending without the complexity of spreadsheets or bloated finance tools.

---

## MVP User Stories

**Auth**

- A user can register for an account with a username and password
- A user can log in to an existing account
- A user can log out
- A returning user who has an active session is automatically logged in when they revisit the app

**Expenses**

- A logged-in user can see all of their expenses
- A logged-in user can add a new expense with a title, amount, category, and date
- A logged-in user can delete an expense they no longer want to track

---

## Stretch Features

- A user can edit an existing expense (update title, amount, category, or date)
- A user can filter their expenses by category to see spending in a specific area
- A user can see a summary dashboard showing their total spending per category

---

## Schema

```
users
─────────────────────────────────────
user_id       SERIAL PRIMARY KEY
username      TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL

expenses
─────────────────────────────────────
expense_id    SERIAL PRIMARY KEY
title         TEXT NOT NULL
amount        NUMERIC(10, 2) NOT NULL
category      TEXT NOT NULL
date          DATE NOT NULL
user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE
```

A user has many expenses. Deleting a user cascades to delete all of their expenses.

### Schema Diagram

```
┌──────────────────────┐          ┌─────────────────────────┐
│         users        │          │        expenses         │
├──────────────────────┤          ├─────────────────────────┤
│ user_id   (PK)       │◄────┐    │ expense_id  (PK)        │
│ username             │     └────│ user_id     (FK)        │
│ password_hash        │          │ title                   │
└──────────────────────┘          │ amount                  │
                                  │ category                │
                                  │ date                    │
                                  └─────────────────────────┘
```

---

## API Contract

### Auth Endpoints

| Method | Endpoint             | Request Body             | Response                          |
| ------ | -------------------- | ------------------------ | --------------------------------- |
| POST   | `/api/auth/register` | `{ username, password }` | `{ user_id, username }`           |
| POST   | `/api/auth/login`    | `{ username, password }` | `{ user_id, username }`           |
| DELETE | `/api/auth/logout`   | —                        | `{ message }`                     |
| GET    | `/api/auth/me`       | —                        | `{ user_id, username }` or `null` |

### Expense Endpoints

| Method | Endpoint                    | Request Body                        | Response                                                   |
| ------ | --------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| GET    | `/api/expenses`             | —                                   | `[{ expense_id, title, amount, category, date, user_id }]` |
| POST   | `/api/expenses`             | `{ title, amount, category, date }` | `{ expense_id, title, amount, category, date, user_id }`   |
| PATCH  | `/api/expenses/:expense_id` | `{ title, amount, category, date }` | `{ expense_id, title, amount, category, date, user_id }`   |
| DELETE | `/api/expenses/:expense_id` | —                                   | `{ expense_id, title, amount, category, date, user_id }`   |

---

## Setup

### 1. Database

Create a local Postgres database:

```sh
createdb expense_tracker
```

### 2. Server

```sh
cd server
npm install
cp .env.template .env
```

Open .env and fill in your Postgres credentials and a session secret. Then seed the database:

```sh
npm run db:seed
```

Start the server:

```sh
npm run dev
```

The server runs on `http://localhost:8080`.

### 3. Frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`. The Vite dev proxy forwards all `/api` requests to the Express server so session cookies work correctly.

---

## Seed Users

After running `npm run db:seed`, these accounts are available:

| Username | Password    |
| -------- | ----------- |
| alice    | password123 |
| bob      | password123 |

---

## Application Structure

```
expense-tracker/
├── frontend/                   # React app (Vite)
│   ├── src/
│   │   ├── App.jsx             # Root component: currentUser state, session rehydration, auth handlers
│   │   ├── adapters/
│   │   │   ├── auth-adapters.js      # Fetch wrappers for /api/auth/* endpoints
│   │   │   └── expense-adapters.js   # Fetch wrappers for /api/expenses/* endpoints
│   │   └── components/
│   │       ├── AuthPage.jsx          # Login + Register forms (shown when logged out)
│   │       ├── ExpensePage.jsx       # Main app container (shown when logged in)
│   │       ├── AddExpenseForm.jsx    # Form to create a new expense
│   │       ├── ExpenseList.jsx       # Renders a list of ExpenseItems
│   │       └── ExpenseItem.jsx       # Single expense: title, amount, category, date, delete button
│   └── vite.config.js          # Proxies /api requests to Express in development
└── server/                     # Express + Postgres API
    ├── index.js                # App entry point, route definitions
    ├── controllers/
    │   ├── authControllers.js      # register, login, logout, getMe
    │   └── expenseControllers.js   # list, create, update, delete expenses
    ├── models/
    │   ├── userModel.js            # SQL queries for the users table
    │   └── expenseModel.js         # SQL queries for the expenses table
    ├── middleware/
    │   ├── checkAuthentication.js  # Blocks unauthenticated requests
    │   └── logRoutes.js            # Logs each incoming request
    └── db/
        ├── pool.js                 # Postgres connection pool
        └── seed.js                 # Creates tables and inserts sample data
```

---

## Roadmap

Stretch features planned for future iterations:

- **Edit expenses** — Allow users to update any field on an existing expense
- **Filter by category** — Let users view expenses scoped to a single category (e.g. "Food", "Transport")
- **Category summary dashboard** — Show total spending per category so users can spot patterns at a glance
