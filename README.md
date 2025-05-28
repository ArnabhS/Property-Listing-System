# Property Listing Application

A property listing application built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- User authentication and authorization
- Property listing management
- File uploads support
- Redis caching for improved performance
- CSV data processing
- RESTful API architecture

## 📁 Project Structure

```
property-listing/
├── src/                    # Source code directory
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── index.ts          # Application entry point
├── uploads/              # File upload directory
├── .gitignore           # Git ignore file
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Dependency lock file
└── tsconfig.json        # TypeScript configuration
```

## 🛠️ Technologies Used

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Programming language
- **MongoDB**: Database
- **Redis**: Caching
- **JWT**: Authentication
- **Multer**: File uploads
- **CSV Parser**: CSV data processing
- **Bcrypt**: Password hashing


### Development Dependencies
- TypeScript and related type definitions
- ts-node-dev for development
- Various type definitions for better TypeScript support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ArnabhS/Property-Listing-System.git
   cd Property-Listing-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   REDIS_URI=your_redis_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

- `npm run dev`: Starts the development server
- `npm run start`: Starts the server for production 

## 🔒 Environment Variables

The following environment variables are required:

- `PORT`: Server port number
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URI`: Redis connection string
- `JWT_SECRET`: Secret key for JWT token generation

