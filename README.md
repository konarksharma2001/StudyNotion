# StudyNotion

A full-stack online learning platform built with React and Node.js that connects students and instructors through course discovery, content delivery, progress tracking, reviews, payments, and real-time communication.

> **Portfolio / Resume Project**
> This project demonstrates end-to-end full-stack development, including frontend architecture, REST APIs, authentication and authorisation, MongoDB data modelling, media uploads, payment verification, email workflows, and real-time WebSocket communication.

## Overview

StudyNotion is designed as a role-based e-learning platform with two primary user experiences:

- **Students** can browse courses, view course details, add courses to a cart, make payments, access enrolled courses, track lecture completion, manage their profile, and submit course ratings/reviews.
- **Instructors** can manage their instructor dashboard, create and edit courses, organise course content into sections and subsections, upload course media, and view course-related information.

The application uses a React frontend backed by an Express/Mongoose API server. The client uses Redux Toolkit for application state and React Router for navigation and protected routes. The backend integrates MongoDB, Cloudinary, Razorpay, Nodemailer, JWT authentication, and WebSockets.

## Key Features

### Student Experience

- Course discovery and catalog browsing
- Course detail pages with instructor, category, rating, content structure, and duration information
- Shopping cart and multi-course checkout flow
- Razorpay payment order creation and signature verification
- Automatic course enrolment after successful payment
- Course progress tracking with completed lectures
- Enrolled-course dashboard
- Course ratings and reviews
- Profile management and display-picture updates
- Password change and account deletion
- Email-based OTP verification during registration
- Password reset workflow
- Real-time chat support / communication layer

### Instructor Experience

- Instructor-specific dashboard
- Create, edit, and delete courses
- Course metadata management including title, description, pricing, category, tags, instructions, and status
- Thumbnail/media uploads through Cloudinary
- Section and subsection management for course curriculum
- Instructor course listing and management
- Student/course analytics exposed through the instructor dashboard APIs

The frontend explicitly separates protected routes and instructor/student experiences. Instructor routes include course creation and management, while student routes include the cart, enrolled courses, and course viewing flow.

## Engineering Highlights

### Authentication & Authorisation

- JWT-based authentication
- Password hashing with `bcrypt`
- HTTP-only cookie support for authentication tokens
- OTP-based email verification
- Protected frontend routes with `PrivateRoute` / `OpenRoute`
- Backend role-based middleware for **Student**, **Instructor**, and **Admin** access

The backend authentication middleware validates JWTs and provides role-specific guards for protected operations.

### Course Management

Courses are modelled as structured learning content with relationships between users, categories, sections, subsections, ratings/reviews, and progress records. Instructors can create courses and upload thumbnails to Cloudinary, while students receive course details and completion state through dedicated APIs.

### Payments

The application integrates **Razorpay** for paid course purchases.

The payment workflow includes:

1. Calculate the total price for the selected courses.
2. Create a Razorpay order.
3. Receive payment details from the client.
4. Verify the Razorpay signature on the server using HMAC-SHA256.
5. Enrol the student into the purchased courses.
6. Create the student's course-progress records.
7. Send enrolment/payment confirmation emails.

### Real-Time Communication

The backend includes a WebSocket server using the `ws` package. Messages are persisted to MongoDB and broadcast to connected clients, providing a real-time communication layer alongside the REST API.

### State Management

Redux Toolkit is used to manage client-side application state. The project contains dedicated slices for authentication, cart, courses, profiles, and course viewing, with Redux Persist also included in the frontend stack.

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI development |
| React Router DOM | Client-side routing |
| Redux Toolkit | Application state management |
| React Redux | Redux integration with React |
| Axios | HTTP/API communication |
| Tailwind CSS | Utility-first styling |
| Material UI | UI components |
| React Hook Form | Form handling and validation |
| Chart.js / React Chart.js 2 | Dashboard visualisation |
| Swiper | Interactive sliders/carousels |
| Video React | Course video playback |
| React Markdown | Markdown rendering |
| WebSocket / Socket.io packages | Real-time communication |

The frontend dependencies and development scripts are defined in the root `package.json`.

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server-side runtime |
| Express.js | REST API framework |
| MongoDB | Primary database |
| Mongoose | ODM and data modelling |
| JWT | Authentication |
| bcrypt | Password hashing |
| Nodemailer | Transactional email |
| OTP Generator | OTP generation |
| Cloudinary | Image/media storage |
| Razorpay | Payment processing |
| WebSocket (`ws`) | Real-time messaging |
| dotenv | Environment configuration |
| express-fileupload | File uploads |

## Architecture

```text
                         ┌───────────────────────┐
                         │       React UI         │
                         │ React Router + Redux   │
                         └───────────┬───────────┘
                                     │
                              Axios / HTTP
                                     │
                         ┌───────────▼───────────┐
                         │     Express API       │
                         │ Controllers + Routes  │
                         └──────┬──────┬─────────┘
                                │      │
                ┌───────────────┘      └────────────────┐
                │                                        │
        ┌───────▼────────┐                       ┌───────▼────────┐
        │    MongoDB     │                       │   Cloudinary    │
        │   + Mongoose   │                       │ Media Storage   │
        └────────────────┘                       └─────────────────┘
                │
        ┌───────▼────────┐        ┌─────────────────────────────┐
        │ Course / User  │        │ External Integrations       │
        │ Progress / OTP │        │ Razorpay + Nodemailer       │
        │ Reviews / Chat │        │ WebSocket                   │
        └────────────────┘        └─────────────────────────────┘
```

### Frontend Structure

```text
src/
├── components/        # Reusable UI and feature components
│   └── core/
├── pages/             # Route-level pages
├── services/          # API connectors and business operations
├── slices/            # Redux Toolkit slices
├── reducer/           # Redux store/reducer configuration
├── hooks/             # Custom React hooks
├── data/              # Navigation and page data
├── utils/             # Shared constants and helpers
└── assets/            # Static frontend assets
```

### Backend Structure

```text
server/
├── config/            # Database, Cloudinary, Razorpay configuration
├── controllers/       # Business logic for auth, courses, payments, etc.
├── middleware/        # Authentication and role authorisation
├── models/            # Mongoose schemas
├── routes/            # API route definitions
├── mail/              # Email templates
├── utils/             # Upload, email, and helper utilities
└── index.js            # Express + WebSocket server entry point
```

## API Domains

The frontend centralises backend endpoints in `src/services/apis.js`.

| Domain | Example Responsibilities |
|---|---|
| Authentication | Signup, login, OTP, password reset, change password |
| Profile | User details, enrolled courses, instructor dashboard, profile settings |
| Courses | Browse, create, edit, delete, categories, sections, subsections |
| Learning | Full course details and lecture completion |
| Payments | Create order, verify payment, send payment confirmation |
| Reviews | Create and fetch course ratings/reviews |
| Contact | Contact-us form submission |
| Chat | Retrieve persisted chat messages and WebSocket communication |

## Data Model

The backend contains dedicated MongoDB/Mongoose models for core entities including:

- `User`
- `Profile`
- `Course`
- `Category`
- `Section`
- `Subsection`
- `CourseProgress`
- `RatingAndReview`
- `OTP`
- `ChatMessage`

These models support relationships such as instructors owning courses, categories containing courses, courses containing sections/subsections, and students having course-progress records.

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js 18+ recommended
- npm
- MongoDB database
- Cloudinary account
- Razorpay account with API credentials
- SMTP/mail account for email functionality

### 1. Clone the repository

```bash
git clone https://github.com/konarksharma2001/StudyNotion.git
cd StudyNotion
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables

Create `server/.env` using `server/.env.example` as the template.

```env
JWT_SECRET=your_jwt_secret
MONGODB_URL=your_mongodb_connection_string
MAIL_HOST=your_smtp_host
MAIL_USER=your_mail_username
MAIL_PASS=your_mail_password

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_cloudinary_folder
```

> **Important:** Never commit real API keys, database credentials, JWT secrets, or SMTP passwords to Git. Use environment variables locally and in deployment.

### 5. Configure the frontend API URL

Create a root `.env` file if needed and set:

```env
REACT_APP_BASE_URL=your_backend_api_base_url
```

### 6. Start the application

From the project root, the repository provides a combined development script:

```bash
npm run dev
```

Or run the frontend and backend independently:

```bash
# Frontend
npm start
```

```bash
# Backend
cd server
npm run dev
```

The Express API runs on port `4000` by default, while the WebSocket server is configured on port `8080`.

## Typical Student Flow

```text
Student
  │
  ├── Sign up
  │    └── OTP verification
  │
  ├── Browse catalog
  │    └── View course details
  │
  ├── Add course to cart
  │
  ├── Checkout
  │    └── Razorpay order
  │
  ├── Payment verification
  │    └── Server-side signature validation
  │
  ├── Course enrolment
  │    └── Create course-progress record
  │
  └── Watch lectures
       └── Track completion + submit review
```

## What This Project Demonstrates

StudyNotion showcases practical full-stack engineering across the application lifecycle:

- Designing a React application with reusable components and route-based page structure
- Managing global client state with Redux Toolkit
- Building and consuming REST APIs with Axios and Express
- Structuring a Node.js backend using routes, controllers, models, middleware, and utilities
- Implementing JWT authentication and role-based access control
- Modelling relational-style application data using MongoDB references and Mongoose
- Handling file uploads and external media storage with Cloudinary
- Integrating a third-party payment gateway and verifying payment signatures server-side
- Building transactional email workflows
- Tracking user-specific learning progress
- Implementing real-time communication with WebSockets
- Supporting separate workflows for students and instructors

## Project Notes

This repository is a portfolio project and reflects the current implementation in the codebase. Some integrations depend on external services and valid credentials, so a local setup requires the corresponding third-party configuration.

## Author

**Konark Sharma**

GitHub: [@konarksharma2001](https://github.com/konarksharma2001)

## License

This project is licensed under the **ISC License** as specified by the backend package configuration.
