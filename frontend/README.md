# Frontend - AI Analytics Dashboard

## Overview
This is the frontend application for the Traffic Violation Dashboard. It provides a modern, responsive user interface for visualizing, uploading, and managing traffic violation data. The frontend is built with React and communicates with the backend API for authentication, data upload, and analytics.

## Features
- User authentication (login/register)
- Dashboard with KPI stats, charts, and maps
- File upload for violation data
- Filtering and searching of violations
- Responsive layout with sidebar navigation
- Error boundaries and loading states

## Tech Stack
- **Framework:** React (with Vite)
- **State Management:** Redux Toolkit
- **Styling:** CSS Modules
- **Linting:** ESLint

## Folder Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and SVGs
│   ├── components/
│   │   ├── common/        # Reusable common components (Loader, ErrorBoundary, FileUploader)
│   │   ├── dashboard/     # Dashboard-specific components (charts, tables, map, KPIs)
│   │   ├── layout/        # Layout components (Navbar, Sidebar, Layout)
│   │   └── ui/            # UI primitives (Button, Card, Input, Modal)
│   ├── pages/             # Page-level components (Dashboard, Login, Register, UploadPage)
│   ├── store/             # Redux slices and store setup
│   ├── utils/             # Utility functions (validation, etc.)
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json           # Project metadata and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)

### Installation
1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App
- Start the development server:
  ```sh
  npm run dev
  ```
- The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Available Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality

## Usage
- Register or log in to access the dashboard.
- Upload traffic violation data via the Upload page.
- Use the dashboard to view analytics, filter data, and explore violations on the map and in tables.

## Environment Variables
Create a `.env` file in the `frontend` directory if you need to override defaults. Common variables:
```
VITE_API_URL=http://localhost:3000/api
```

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License
This project is licensed under the MIT License.
