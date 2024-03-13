// Import Express framework
import express from 'express';

// Import defined routes from the routes folder
import routes from './routes/index';

// Create an instance of Express application
const app = express();

// Define port number to listen on (use the environment variable PORT if available,
//      otherwise default to 5000)
const PORT = process.env.PORT || 5000;

// Add middleware to parse JSON requests for task 3
app.use(express.json());

// Middleware to use defined routes for all requests
app.use('/', routes);

// Starts Express server and listen on specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
