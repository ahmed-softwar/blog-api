# Blog API

A RESTful Blog API built with **Node.js**, **Express.js**, and **MySQL**.

This project provides user authentication, role-based authorization, blog management, input validation, search, pagination, and image uploads.

## Features

- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Role-based authorization (Admin and User).
- Create, read, update, and delete blog posts.
- Blog ownership protection.
- Search blogs by title.
- Pagination for blog results.
- User profile management.
- Admin user management.
- Input validation using express-validator.
- Image uploads using Multer.
- Centralized error handling.
- MySQL database integration.

## Technologies

- Node.js
- Express.js
- MySQL
- mysql2
- JSON Web Token (JWT)
- bcrypt
- express-validator
- Multer
- dotenv

## Project Structure

```text
blog-api/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── authController.js
│   ├── blogController.js
│   └── userController.js
│
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── isAdmin.js
│   └── upload.js
│
├── routes/
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   └── userRoutes.js
│
├── validations/
│   ├── authValidation.js
│   ├── blogValidation.js
│   └── userValidation.js
│
├── uploads/
├── .env.example
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ahmed-softwar/blog-api.git
cd blog-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root based on `.env.example`.

Configure your database credentials and JWT secret.

### 4. Configure the database

Create a MySQL database and the required tables:

- `users`
- `bloogs`

The application expects the database columns used by its controllers.

### 5. Run the application

```bash
npm start
```

The server runs on port `3000` by default.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT |

### Blogs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/bloogs` | Get all blogs |
| GET | `/bloogs/:id` | Get a blog by ID |
| POST | `/bloogs` | Create a blog (Authentication required) |
| PATCH | `/bloogs/:id` | Update a blog (Owner or Admin) |
| DELETE | `/bloogs/:id` | Delete a blog (Owner or Admin) |
| GET | `/bloogs/search` | Search blogs by title |
| GET | `/bloogs/search/pagination` | Search blogs with pagination |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Search users (Admin only) |
| GET | `/users/:id` | Get user by ID (Admin only) |
| PATCH | `/users/profile` | Update own profile |
| DELETE | `/users/profile` | Delete own account |
| PATCH | `/users/:id` | Update a user (Admin only) |
| DELETE | `/users/:id` | Delete a user (Admin only) |

## Authentication

Protected endpoints require a JWT token in the Authorization header.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Image Uploads

Blog images can be uploaded using `multipart/form-data`.

Use the field name:

```text
image
```

Supported formats:

- JPG
- PNG
- WEBP

Maximum file size: **5 MB**.

Uploaded images are served from:

```text
/uploads/
```

## Search and Pagination

Search blogs using the `searchkey` query parameter.

Example:

```http
GET /bloogs/search?searchkey=node
```

Pagination example:

```http
GET /bloogs/search/pagination?searchkey=node&page=1&limit=10
```

## Error Handling

The API uses standard HTTP status codes, including:

- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `500` Internal Server Error

## Author

**Ahmed**

GitHub: [ahmed-softwar](https://github.com/ahmed-softwar)

Repository: [blog-api](https://github.com/ahmed-softwar/blog-api)
