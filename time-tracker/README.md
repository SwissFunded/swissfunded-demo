# Time Tracker

A minimalistic time tracking application for companies. Employees can clock in and out, view their hours, and delete incorrect entries.

## Features

- Clock in/out functionality
- View total hours worked
- Delete incorrect time entries
- Employee statistics
- Clean, minimalistic design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/time-tracker
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start the backend server
   npm run dev

   # In a new terminal, start the frontend
   cd client
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Enter your name in the input field
2. Click "Clock In" to start tracking time
3. Click "Clock Out" when you're done
4. View your total hours in the statistics section
5. Delete any incorrect entries by clicking the "Delete" button

## Production Deployment

For production deployment, you'll need to:

1. Build the React application:
   ```bash
   cd client
   npm run build
   ```

2. Set up environment variables for production
3. Configure your MongoDB connection string
4. Deploy the backend server
5. Serve the built frontend files

## License

MIT 