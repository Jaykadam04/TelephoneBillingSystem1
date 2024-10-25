const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(bodyParser.json());


db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});


const customerRoutes = require('./routes/customerRoutes');
const billRoutes = require('./routes/billRoutes');
const callLogRoutes = require('./routes/callLogRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const tariffPlanRoutes = require('./routes/tariffPlanRoutes');

const billGeneration = require('./routes/billGeneration');


app.use('/customers', customerRoutes);
app.use('/bills', billRoutes); 
app.use('/calllogs', callLogRoutes);
app.use('/payments', paymentRoutes);
app.use('/tariffplans', tariffPlanRoutes);
app.use('/billGeneration', billGeneration); 


const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
