Split Share is a RESTful backend API designed to simplify shared expense management among groups. It allows users to securely create accounts, manage groups, add members, record expenses, and track settlements through a scalable and well-structured backend architecture.

The project emphasizes secure authentication, clean API design, validation, error handling, and maintainable code organization. It follows a layered architecture pattern (Route → Controller → Service → Database) and is fully documented using Swagger UI for easy API exploration and testing.

## Live Demo

### Live API

https://split-share-898m.onrender.com

### API Documentation (Swagger UI)

https://split-share-898m.onrender.com/api-docs

## Key Highlights

* JWT-based Authentication with Refresh Token Rotation
* Email Verification and Password Recovery Workflows
* Group Creation and Member Management
* Shared Expense Tracking and Settlement Calculation
* Joi-based Request Validation
* Global Error Handling Middleware
* Interactive Swagger API Documentation
* MongoDB Atlas Database Integration
* Render Cloud Deployment

## Features

### Authentication & Account Management

* User Registration with Email Verification
* Secure Login and Logout Functionality
* JWT-based Authentication
* Refresh Token Rotation for Session Management
* Forgot Password and Password Reset Workflows
* Protected Routes using Authentication Middleware

### Group Management

* Create and Manage Expense Groups
* Add Members to Existing Groups
* View Groups Associated with the Logged-in User
* Restrict Group Operations to Authorized Members

### Expense Management

* Record Shared Expenses within Groups
* Track Total Group Expenditure
* Calculate Individual Member Shares
* Maintain Expense Records for Settlement Tracking

### Validation & Error Handling

* Request Validation using Joi DTOs
* Consistent API Responses
* Centralized Global Error Handling
* Custom Error Classes for Standardized Error Responses

## Authentication Flow

1. User registers with name, email, and password.
2. A verification email is sent to the registered email address.
3. The user verifies their account through the verification link.
4. Upon login, the API issues an access token and refresh token.
5. Protected routes require a valid access token.
6. Expired access tokens can be refreshed using refresh token rotation.
7. Password recovery is handled through secure reset links sent via email.

## Security Features

* Password Hashing using bcrypt
* JWT Access and Refresh Tokens
* Refresh Token Rotation
* Hashed Refresh Tokens Stored in Database
* Hashed Email Verification Tokens
* Hashed Password Reset Tokens
* HTTP-only Cookie Support
* Route Protection through Authentication Middleware

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication & Security

* JSON Web Tokens (JWT)
* Refresh Token Rotation
* bcrypt Password Hashing
* Node.js Crypto for Token Hashing
* HTTP-only Cookies

### Validation

* Joi

### Email Services

* Nodemailer
* SMTP Integration

### API Documentation

* Swagger UI
* Swagger JSDoc

### Deployment

* Render

## Architecture

The project follows a layered architecture pattern to ensure separation of concerns, maintainability, and scalability.

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database
```

### Layer Responsibilities

#### Routes

Define API endpoints and connect requests to controllers.

#### Controllers

Handle incoming requests and responses while delegating business logic to services.

#### Services

Contain the core business logic, authentication workflows, validation checks, and database operations.

#### Database Layer

Manages data persistence using MongoDB and Mongoose models.

## Design Principles

* Separation of Concerns
* Reusable Service Layer
* DTO-based Request Validation using Joi
* Centralized Global Error Handling
* Consistent API Response Structure
* Secure Authentication and Session Management

## Security Implementation

* Passwords are hashed using bcrypt before storage.
* Refresh tokens are rotated to reduce the impact of token leakage.
* Verification, refresh, and password reset tokens are hashed using Node.js Crypto before being stored in the database.
* Protected routes are secured through authentication middleware.
* HTTP-only cookies are used to improve token security.


## Project Structure

```text
src/
├── common/
│   ├── config/
│   ├── middleware/
│   └── utils/
│
├── module/
│   ├── auth/
│   ├── group/
│   └── expense/
│
├── app.js
└── server.js
```

The project follows a modular architecture where each feature is organized into its own module containing routes, controllers, services, models, and DTOs. This structure improves maintainability, scalability, and separation of concerns.

## API Modules

### Authentication Module

Handles user account management and authentication workflows.

**Features:**

* User Registration
* Email Verification
* User Login
* User Logout
* Refresh Token Generation
* Forgot Password
* Reset Password
* Get Current User

### Group Module

Manages group creation and member management.

**Features:**

* Create Group
* View User Groups
* View Group Details
* Add Members to Groups
* Search Users
* Delete Groups

### Expense Module

Handles expense tracking and settlement calculations.

**Features:**

* Create Expenses
* Track Group Expenses
* Calculate Member Shares
* Manage Settlement Records

## API Documentation

Comprehensive API documentation is available through Swagger UI.

**Swagger URL:**

https://split-share-898m.onrender.com/api-docs

The documentation includes:

* Endpoint descriptions
* Request body schemas
* Response codes
* Authentication requirements
* Interactive API testing


## Installation

### Clone the Repository

```bash
git clone https://github.com/saagar-shankar/split-share.git
```

### Navigate to Project Directory

```bash
cd split-share
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The server will start on:

```text
http://localhost:4000
```

Swagger documentation will be available at:

```text
http://localhost:4000/api-docs
```

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=4000
NODE_ENV=development

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

SMTP_FROM_NAME=
SMTP_FROM_EMAIL=

CLIENT_URL=
```

## Database Setup

This project uses MongoDB Atlas for data storage.

1. Create a MongoDB Atlas cluster.
2. Obtain the connection string.
3. Add the connection string to the `MONGODB_URI` environment variable.
4. Start the application.

## Running the Application

After configuring the environment variables:

```bash
npm run dev
```

Expected output:

```text
MongoDB connected...
Server is running on port : 4000 in Development Mode
```

## Future Improvements

The following enhancements can be added in future iterations of the project:

* Expense Settlement History
* Group Invitation System
* Role-Based Access Control (RBAC)
* Real-Time Notifications
* Expense Categories and Analytics
* Recurring Expense Management
* Frontend Client Integration
* API Rate Limiting
* Comprehensive Automated Testing
* Docker Containerization
* CI/CD Pipeline Integration

## Learning Outcomes

Through this project, I understood:

* RESTful API Design
* JWT Authentication and Refresh Token Rotation
* Email Verification and Password Recovery Workflows
* MongoDB Data Modeling with Mongoose
* Service Layer Architecture
* Joi-based Request Validation
* Global Error Handling
* Swagger API Documentation
* Cloud Deployment using Render
* Secure Token and Password Management

## Author

**Sagar Shankar**

* GitHub: https://github.com/saagar-shankar
* LinkedIn: https://linkedin.com/in/sagar-shankar248

## License

This project is intended for educational, learning, and portfolio purposes.
