# Aerovania Backend API

A secure, optimized Node.js/Express API for the Aerovania drone analytics dashboard with user authentication and role-based access control.

## Features

- ✅ **User Authentication** - JWT-based authentication with refresh tokens
- ✅ **Role-Based Access Control** - Admin, User, and Viewer roles
- ✅ **Rate Limiting** - Protection against API abuse
- ✅ **Data Validation** - Input validation using Joi
- ✅ **Secure Password Storage** - Bcrypt password hashing
- ✅ **RESTful API Design** - Clean, organized endpoint structure
- ✅ **Database Optimization** - Indexed queries and connection pooling
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **Backward Compatibility** - Maintains existing endpoint structure

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/drone_analytics
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Make sure PostgreSQL is running, then the application will automatically initialize the database tables and create a default admin user:

- **Email**: admin@aerovania.com
- **Password**: admin123

### 4. Start the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:8000`

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/refresh-token` | Refresh access token | Public |
| GET | `/api/auth/profile` | Get user profile | Authenticated |
| PUT | `/api/auth/profile` | Update profile | Authenticated |
| PUT | `/api/auth/change-password` | Change password | Authenticated |
| POST | `/api/auth/logout` | Logout user | Authenticated |

### Report Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/reports/upload` | Upload drone report | User/Admin |
| GET | `/api/reports/violations` | Get violations with filters | Authenticated |
| GET | `/api/reports/kpis` | Get KPI statistics | Authenticated |
| GET | `/api/reports/filters` | Get filter options | Authenticated |
| GET | `/api/reports/:id` | Get specific report | Authenticated |
| DELETE | `/api/reports/:id` | Delete report | Admin only |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/users` | Get all users | Admin only |
| GET | `/api/admin/users/:id` | Get specific user | Admin only |
| POST | `/api/admin/users` | Create new user | Admin only |
| DELETE | `/api/admin/users/:id` | Deactivate user | Admin only |
| GET | `/api/admin/stats` | Get system statistics | Admin only |

### Backward Compatibility

The following endpoints are maintained for compatibility:

- `/api/upload` → `/api/reports/upload`
- `/api/violations` → `/api/reports/violations`
- `/api/kpis` → `/api/reports/kpis`
- `/api/filters` → `/api/reports/filters`

## Authentication

### Login Example

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { tokens, user } = await response.json();
// Store tokens.accessToken for subsequent requests
```

### Making Authenticated Requests

```javascript
const response = await fetch('/api/reports/violations', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## User Roles

- **Admin**: Full access to all endpoints, user management
- **User**: Can upload reports and view all data
- **Viewer**: Read-only access to reports and analytics

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Upload**: 10 uploads per minute

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error description",
  "code": "ERROR_CODE", // Optional
  "details": {} // Optional additional details
}
```

## Security Features

- JWT tokens with expiration
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting protection
- CORS configuration
- SQL injection prevention

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `role` (admin/user/viewer)
- `created_at`, `updated_at`, `last_login`
- `is_active`

### Reports Table
- `id` (Primary Key)
- `drone_id`
- `date`
- `location`
- `uploaded_by` (Foreign Key to users)
- `created_at`

### Violations Table
- `id` (Primary Key)
- `report_id` (Foreign Key to reports)
- `violation_id`
- `type`
- `timestamp`
- `latitude`, `longitude`
- `image_url`
- `created_at`

## Performance Optimizations

- Database connection pooling
- Indexed database queries
- Parallel query execution for KPIs
- Efficient data validation
- Memory-optimized file uploads
- Proper error handling to prevent crashes

## Development

### Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, rate limiting, etc.
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   └── utils/          # Utilities (validation, JWT, DB)
├── server-optimized.js # Main server file
├── package.json
└── .env.example
```

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Define routes in `src/routes/`
4. Add validation schemas in `src/utils/validation.js`
5. Update this README

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper database connection
4. Set up SSL/HTTPS
5. Configure proper CORS origins
6. Set up monitoring and logging
7. Use PM2 or similar for process management

## Support

For issues or questions, please check the API documentation or contact the development team.
