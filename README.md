# Student Grievance Management System

A full-stack web application built with the MERN stack for managing student grievances efficiently.

## Features

### Backend (Node.js + Express + MongoDB)
- **Authentication**: User registration and login with JWT tokens
- **Password Security**: bcrypt for password hashing
- **Database**: MongoDB with Mongoose ODM
- **API Endpoints**:
  - `POST /api/auth/register` - Register a new student
  - `POST /api/auth/login` - Login student
  - `POST /api/grievances` - Submit a grievance
  - `GET /api/grievances` - View all grievances (for logged-in user)
  - `GET /api/grievances/:id` - View specific grievance
  - `PUT /api/grievances/:id` - Update grievance
  - `DELETE /api/grievances/:id` - Delete grievance
  - `GET /api/grievances/search?title=xyz` - Search grievances by title

### Frontend (React)
- **User Authentication**: Registration and login forms
- **Dashboard**: Comprehensive grievance management
- **CRUD Operations**: Create, read, update, delete grievances
- **Search Functionality**: Search grievances by title
- **Responsive Design**: Mobile-friendly interface
- **Route Protection**: Only authenticated users can access dashboard

## Database Schema

### Student Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed)
}
```

### Grievance Model
```javascript
{
  title: String (required),
  description: String (required),
  category: String (enum: ['Academic', 'Hostel', 'Transport', 'Other']),
  date: Date (default: current date),
  status: String (enum: ['Pending', 'Resolved'], default: 'Pending'),
  student: ObjectId (ref: 'Student')
}
```

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running
- Git

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/student-grievance
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   For development:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. **Register**: Create a new student account with name, email, and password
2. **Login**: Access your account with registered credentials
3. **Dashboard**: 
   - Submit new grievances with title, description, and category
   - View all your grievances
   - Search grievances by title
   - Update or delete existing grievances
   - View grievance status (Pending/Resolved)
4. **Logout**: Securely exit your account

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Route protection for authenticated users
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Error Handling

- Invalid login credentials
- Duplicate email registration
- Unauthorized access attempts
- Server error handling
- User-friendly error messages

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv

### Frontend
- React
- React Router
- Axios
- CSS3

## Deployment

### GitHub
1. Initialize git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create GitHub repository and push code

### Render
1. Deploy backend to Render
   - Connect GitHub repository
   - Set environment variables
   - Configure MongoDB connection

2. Deploy frontend to Render
   - Connect GitHub repository
   - Configure build and start commands

## Future Enhancements

- Admin dashboard for grievance management
- Email notifications
- File attachments for grievances
- Advanced filtering and sorting
- Analytics and reporting
- Real-time updates with WebSocket
