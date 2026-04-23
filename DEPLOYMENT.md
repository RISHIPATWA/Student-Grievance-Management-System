# Deployment Instructions

## GitHub Setup

1. Create a new repository on GitHub
2. Add remote origin:
   ```bash
   git remote add origin https://github.com/yourusername/student-grievance-system.git
   ```
3. Push to GitHub:
   ```bash
   git push -u origin master
   ```

## Render Deployment

### Backend Deployment

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: student-grievance-backend
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string
   - `PORT`: 5000

6. Click "Create Web Service"

### Frontend Deployment

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: student-grievance-frontend
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Publish Directory**: build
   - **Node Version**: 18

4. Add Environment Variables:
   - `REACT_APP_API_URL`: Your backend Render URL

5. Click "Create Static Site"

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to Render environment variables

### Option 2: Render MongoDB
1. In Render Dashboard, click "New +" → "MongoDB"
2. Choose free plan
3. Create database
4. Copy connection string to backend environment variables

## Testing the Application

1. Register a new student account
2. Login with credentials
3. Submit a grievance
4. Test all CRUD operations
5. Test search functionality
6. Verify error handling

## Deployment Links
- **Backend**: https://your-app-name.onrender.com
- **Frontend**: https://your-app-name.onrender.com
- **GitHub**: https://github.com/yourusername/student-grievance-system

Add these links to your documentation as required.
