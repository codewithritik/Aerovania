# Aerovania Drone Analytics Platform

---

## 🚀 Live Demo

The project is deployed and available at: [https://aerovania.onrender.com/](https://aerovania.onrender.com/)
for backend : [https://aerovania.onrender.com/api](https://aerovania.onrender.com/api)
---

A full-stack solution for drone-based traffic violation analytics, featuring a secure backend API and a modern, interactive frontend dashboard.

---

## Tech Stack

### Backend
- **Node.js** (Express)
- **PostgreSQL**
- **JWT Authentication**
- **Joi** (Validation)
- **Bcrypt** (Password Hashing)
- **Docker** (optional)

### Frontend
- **React** (with Vite)
- **Redux Toolkit** (State Management)
- **CSS Modules**
- **ESLint**
- **react-leaflet** (Interactive Maps)
- **recharts** (Charts & Graphs)
- **react-table** (Data Tables)
- **Tailwind-css** (css)
---

## Folder Structure

```text
backend/   # Node.js/Express API
frontend/  # React dashboard app
```

### Backend
```text
backend/
├── src/
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Auth, rate limiting, etc.
│   ├── models/        # Database models
│   ├── routes/        # API route definitions
│   └── utils/         # Utilities (validation, JWT, DB)
├── server-optimized.js
├── package.json
├── .env.example
```

### Frontend
```text
frontend/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and SVGs
│   ├── components/
│   │   ├── common/        # Loader, ErrorBoundary, FileUploader
│   │   ├── dashboard/     # Charts, tables, map, KPIs
│   │   ├── layout/        # Navbar, Sidebar, Layout
│   │   └── ui/            # Button, Card, Input, Modal
│   ├── pages/             # Dashboard, Login, Register, UploadPage
│   ├── store/             # Redux slices and store setup
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
```

---

## Features

### Backend
- JWT-based authentication (access & refresh tokens)
- Role-based access control (Admin, User, Viewer)
- Rate limiting (API, auth, uploads)
- Secure password storage (bcrypt)
- RESTful API design
- Data validation (Joi)
- Error handling & logging
- Database optimization (indexes, pooling)
- Backward-compatible endpoints

### Frontend
- User authentication (login/register)
- Dashboard with KPI stats, charts, and maps
- File upload for violation data
- Filtering and searching of violations
- Responsive layout with sidebar navigation
- Error boundaries and loading states

---

## Quick Start

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)
- PostgreSQL (for backend)

### Backend Setup
1. `cd backend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy and edit environment variables:
   ```sh
   cp .env.example .env
   # Edit .env as needed
   ```
4. Ensure PostgreSQL is running. The app will auto-initialize tables and create a default admin user.
5. Start the server:
   ```sh
   npm run dev   # Development
   npm start     # Production
   ```
   - API runs at `http://localhost:8000`

### Frontend Setup
1. `cd frontend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   - App runs at `http://localhost:5173` by default

---

## API Overview

- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh-token`, `/api/auth/profile`, `/api/auth/change-password`, `/api/auth/logout`
- **Reports:** `/api/reports/upload`, `/api/reports/violations`, `/api/reports/kpis`, `/api/reports/filters`, `/api/reports/:id`, `/api/reports/:id (DELETE)`
- **Admin:** `/api/admin/users`, `/api/admin/users/:id`, `/api/admin/stats`
- **Legacy:** `/api/upload`, `/api/violations`, `/api/kpis`, `/api/filters`

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/drone_analytics
JWT_SECRET=your_super_secret_jwt_key
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License
This project is licensed under the MIT License.

---

## Deploying on Render

The Aerovania platform is deployed on [Render](https://render.com/). You can view the live app here: [https://aerovania.onrender.com/](https://aerovania.onrender.com/)

To deploy your own instance on Render:

1. Fork or clone this repository.
2. Set up your environment variables in Render's dashboard (do not include them in the Dockerfile).
3. Use the provided Dockerfile in the root directory for deployment.
4. Set the service port to 8000 in Render.
5. The backend will serve the frontend static files from the `/public` directory.

For more details, see the Dockerfile and the instructions above.

---

**Create a new file named `Dockerfile`