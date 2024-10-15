const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Route Imports
const customerRoutes = require('./routes/customerRoutes');
const billRoutes = require('./routes/billRoutes');
const callLogRoutes = require('./routes/callLogRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const tariffPlanRoutes = require('./routes/tariffPlanRoutes');
const billPrintRoutes = require('./routes/billPrintRoutes');

// Route Usage
app.use('/customers', customerRoutes);
app.use('/bills', billRoutes); // Make sure billRoutes is here for bill retrieval
app.use('/calllogs', callLogRoutes);
app.use('/payments', paymentRoutes);
app.use('/tariffplans', tariffPlanRoutes);
app.use('/billprint', billPrintRoutes); // Use a different route for bill printing

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
