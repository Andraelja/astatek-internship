# SmartPark Web Application

A fullstack web application for smart parking management, built with Node.js/Express backend and React frontend.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture & Database Design](#architecture--database-design)
- [API Design](#api-design)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Testing](#testing)
- [Analysis Report](#analysis-report)

## Features

### MVP Features

#### Authentication
- User registration and login
- Role-based access control (USER and ADMIN)

#### Admin Functions
- **Parking Lot Management**: CRUD operations for parking lots
- **Slot Management**: View and manually update slot statuses (AVAILABLE/OCCUPIED)
- **Real-time Simulation**: Simulate IoT sensor data by changing slot statuses

#### User Functions
- **View Availability**: List all parking lots with current availability
- **Lot Detail View**: Visualize parking slots in a grid/list format with real-time status

### Bonus Features

#### Booking & Check-in/Check-out System
- Users can book AVAILABLE slots
- Booked slots become RESERVED
- Check-in changes status to OCCUPIED
- Check-out changes status back to AVAILABLE

#### Admin Analytics Dashboard
- Real-time occupancy statistics
- Per-lot occupancy percentages
- Overall system occupancy

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **CORS**: cors middleware

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React useState/useEffect hooks

### Development Tools
- **Linting**: ESLint
- **Environment Variables**: dotenv

## Architecture & Database Design

### Application Architecture

The application follows a layered architecture:

```
┌─────────────────┐
│   Frontend      │  React SPA
│   (React)       │
└─────────────────┘
         │
    HTTP/REST API
         │
┌─────────────────┐
│   Backend       │  Express.js
│   (Node.js)     │
└─────────────────┘
         │
┌─────────────────┐
│   Database      │  MongoDB
│   (MongoDB)     │
└─────────────────┘
```

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["admin", "user"], default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

#### Parking Lots Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  location: String,
  total_slots: Number (required),
  available_slots: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

#### Parking Slots Collection
```javascript
{
  _id: ObjectId,
  lot_id: ObjectId (ref: "ParkingLot", required),
  slot_number: String (required),
  status: String (enum: ["AVAILABLE", "OCCUPIED", "RESERVED"], default: "AVAILABLE"),
  last_updated: Date (default: Date.now)
}
```

#### Bookings Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: "User", required),
  lot_id: ObjectId (ref: "ParkingLot", required),
  slot_id: ObjectId (ref: "ParkingSlot", required),
  status: String (enum: ["RESERVED", "OCCUPIED", "COMPLETED", "CANCELLED"], default: "RESERVED"),
  checkin_time: Date,
  checkout_time: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Database Relations

- **Users** ↔ **Bookings**: One-to-Many (user can have multiple bookings)
- **Parking Lots** ↔ **Parking Slots**: One-to-Many (lot contains multiple slots)
- **Parking Lots** ↔ **Bookings**: One-to-Many (lot can have multiple bookings)
- **Parking Slots** ↔ **Bookings**: One-to-One active (slot can have one active booking)

## API Design

The API follows RESTful conventions with the following endpoints:

### Authentication Endpoints
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Parking Lot Endpoints
- `GET /api/parking-lot` - Get all parking lots
- `POST /api/parking-lot` - Create new parking lot (Admin only)
- `GET /api/parking-lot/:id` - Get parking lot by ID
- `PUT /api/parking-lot/:id` - Update parking lot (Admin only)
- `DELETE /api/parking-lot/:id` - Delete parking lot (Admin only)
- `GET /api/parking-lot/admin/statistics` - Get occupancy statistics (Admin only)

### Parking Slot Endpoints
- `GET /api/parking-slot` - Get all parking slots
- `POST /api/parking-slot` - Create new parking slot (Admin only)
- `GET /api/parking-slot/:id` - Get parking slot by ID
- `PUT /api/parking-slot/:id` - Update parking slot (Admin only)
- `DELETE /api/parking-slot/:id` - Delete parking slot (Admin only)
- `GET /api/parking-slot/lot/:lotId` - Get slots for specific lot

### Booking Endpoints
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `POST /api/bookings/book` - Book a slot (User)
- `PUT /api/bookings/checkin/:id` - Check-in to booked slot (User)
- `PUT /api/bookings/checkout/:id` - Check-out from slot (User)

### Example API Payloads

#### Register User
```json
POST /api/users/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Book Slot
```json
POST /api/bookings/book
{
  "slot_id": "507f1f77bcf86cd799439031"
}
```

#### Update Slot Status (Admin)
```json
PUT /api/parking-slot/507f1f77bcf86cd799439031
{
  "status": "OCCUPIED"
}
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB connection string and JWT secret:
   ```
   MONGODB_URI=mongodb://localhost:27017/smartpark
   JWT_SECRET=your_jwt_secret_here
   PORT=3001
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
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

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Usage

### Admin User
- **Email**: admin@example.com
- **Password**: admin123

### Regular User
- **Email**: user1@example.com
- **Password**: user123

### Admin Dashboard Features
1. View real-time occupancy statistics
2. Manage parking lots (Create, Read, Update, Delete)
3. View and update individual parking slot statuses
4. Monitor system-wide parking availability

### User Dashboard Features
1. View all parking lots and their availability
2. Select a lot to view detailed slot layout
3. Book available parking slots
4. Check-in and check-out from booked slots
5. View personal booking history

## Testing

### API Testing
Use the provided Postman collection (`SmartPark_API.postman_collection.json`) to test all endpoints.

### Manual Testing Steps

1. **Authentication Testing**:
   - Register a new user
   - Login with existing credentials
   - Verify JWT token generation

2. **Admin Functions**:
   - Create a new parking lot
   - View all parking lots
   - Update parking lot information
   - Delete a parking lot
   - View slots in a specific lot
   - Change slot status from AVAILABLE to OCCUPIED

3. **User Functions**:
   - View list of parking lots with availability
   - Select a lot to view slot details
   - Book an available slot
   - Check-in to a booked slot
   - Check-out from an occupied slot

4. **Statistics**:
   - View admin dashboard statistics
   - Verify statistics update after slot status changes

## Analysis Report

### Architecture & Database Design

#### Why This Architecture?
The chosen architecture separates concerns effectively:
- **Frontend**: Handles UI/UX and user interactions
- **Backend**: Manages business logic, authentication, and data processing
- **Database**: Stores data with proper relationships and constraints

This separation allows for:
- Independent scaling of frontend and backend
- Easier maintenance and testing
- Better security through API-based communication

#### Database Design Rationale
- **MongoDB**: Chosen for flexibility with JSON-like documents and easy scaling
- **Mongoose ODM**: Provides schema validation and relationship management
- **Separate collections**: Allows for efficient queries and data integrity
- **Indexing**: Email field indexed for fast authentication lookups

### Technology Choices

#### Backend Choices
- **Express.js**: Lightweight, unopinionated framework perfect for REST APIs
- **JWT Authentication**: Stateless authentication suitable for web apps
- **bcryptjs**: Secure password hashing with salt
- **Joi Validation**: Schema-based validation for API inputs

#### Frontend Choices
- **React**: Component-based architecture for maintainable UI
- **Vite**: Fast build tool with excellent development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Axios**: Promise-based HTTP client for API calls

#### Why These Technologies?
- **Performance**: Vite provides fast hot reloading, Express is lightweight
- **Developer Experience**: React's component model and Tailwind's utility classes speed up development
- **Scalability**: MongoDB handles growing data needs, JWT scales with multiple servers
- **Security**: bcrypt and JWT provide industry-standard security practices

### API Design

#### RESTful Design Principles
- **Resource-based URLs**: Clear, hierarchical endpoints
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE
- **Status Codes**: Appropriate HTTP status codes for different scenarios
- **JSON Responses**: Consistent response format across all endpoints

#### Authentication & Authorization
- **JWT Middleware**: Protects routes requiring authentication
- **Role-based Access**: Admin-only routes for management functions
- **Error Handling**: Comprehensive error responses for various failure scenarios

### Results & Error Handling Analysis

#### Error Handling Strategy
- **Validation Errors**: Joi schemas validate input data
- **Authentication Errors**: JWT verification with appropriate error messages
- **Database Errors**: Mongoose error handling with user-friendly messages
- **Business Logic Errors**: Custom validation for booking and slot management

#### Common Error Scenarios Handled
- Invalid login credentials
- Duplicate email registration
- Unauthorized access to admin functions
- Attempting to book occupied slots
- Invalid booking operations (check-in without reservation)

#### Biggest Technical Challenge
The most challenging aspect was implementing the booking system with proper state management:
- Ensuring slot availability before booking
- Updating related data (lot availability, slot status, booking status)
- Handling concurrent bookings (though not fully implemented due to time constraints)

**Solution**: Implemented atomic operations using MongoDB transactions and proper validation middleware.

#### Areas for Improvement
Given another week, I would:
1. **Implement WebSocket/Real-time Updates**: Use Socket.io for real-time slot status updates
2. **Add Comprehensive Testing**: Unit tests with Jest, integration tests with Supertest
3. **Implement Caching**: Redis for frequently accessed data like statistics
4. **Add Rate Limiting**: Prevent API abuse with express-rate-limit
5. **Improve UI/UX**: Add loading states, better error messages, and responsive design
6. **Add Logging**: Structured logging with Winston for better debugging
7. **Implement Pagination**: For large datasets in admin views
8. **Add Email Notifications**: For booking confirmations and reminders

### Code Quality & Best Practices

#### Backend Best Practices
- **Separation of Concerns**: Controllers, routes, models, middlewares in separate files
- **Error Handling**: Centralized error handling middleware
- **Security**: Input validation, password hashing, JWT authentication
- **Code Organization**: Logical folder structure following Express conventions

#### Frontend Best Practices
- **Component Architecture**: Reusable components for Auth, Dashboards
- **State Management**: Local component state with React hooks
- **Styling**: Consistent Tailwind CSS classes
- **Error Handling**: User-friendly error messages and loading states

### Reproducibility

The application is designed for easy setup and testing:
- **Clear Documentation**: Step-by-step installation instructions
- **Seed Data**: Consistent initial data for testing
- **Environment Configuration**: Environment variables for different deployments
- **Dependency Management**: package.json files with exact versions

This ensures evaluators can quickly set up and test the application in a clean state.

---

## Demo

For a quick demonstration, see the included GIFs or video showing:
1. User registration and login
2. Admin creating parking lots and managing slots
3. User viewing availability and booking slots
4. Real-time status updates and check-in/check-out flow

## Submission Notes

- **Zip File**: FullName_FS_CaseStudy.zip containing /backend and /frontend folders
- **GitHub Link**: Repository with complete source code
- **Postman Collection**: Included for API testing
- **Environment**: Tested on Windows 11 with Node.js v18 and MongoDB v6

This implementation demonstrates a solid foundation for a smart parking system with room for future enhancements.
