# PG Maintenance System

A full-stack web application for managing Paying Guest (PG) tenants with an admin dashboard.

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Express.js
- **Database**: MySQL
- **Authentication**: Session-based with bcrypt

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database:
   - Update `.env` file with your MySQL credentials
   - Default database name is `pg_maintenance`

4. Start the server:
   ```bash
   npm start
   ```

   The server will automatically:
   - Create the database if it doesn't exist
   - Run the schema to create tables
   - Insert default admin user

   Server runs on: http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend runs on: http://localhost:5173

## Default Credentials

- **Username**: admin
- **Password**: admin123

## Features

- ✅ Owner authentication
- ✅ Add new tenants
- ✅ View all tenants
- ✅ Edit tenant information
- ✅ Delete tenants
- ✅ Search tenants by name, room, or contact
- ✅ Dashboard statistics (total tenants, deposits, occupied rooms)
- ✅ Modern, responsive UI with dark theme

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check auth status

### Tenants
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/:id` - Get single tenant
- `POST /api/tenants` - Create tenant
- `PUT /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant
