# Chitan Notes App

A modern note-taking application with sharing capabilities, built with React and Node.js.

## Features

- Create, update, and delete notes
- Pin important notes for quick access
- Star your favorite notes
- Share notes with other users
- Dark mode support
- Responsive design for mobile and desktop

## Technologies Used

### Frontend:

- React with JSX
- Zustand for state management
- Framer Motion for animations
- React Router for navigation
- Axios for API requests
- Date-fns for date formatting

### Backend:

- Node.js and Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies for both server and frontend:

```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a .env file in the server directory with:

```
PORT=3000
DB_URL=your_mongodb_connection_string
SECRET=your_jwt_secret
```

4. Start the server:

```bash
cd server
npm run dev
```

5. Start the frontend (in a separate terminal):

```bash
cd frontend
npm start
```

## License

This project is licensed under the ISC License
