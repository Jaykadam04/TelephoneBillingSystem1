const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all bills for a specific customer
router.get('/customer/:customerId', (req, res) => {
  const billId = req.params.customerId;
  
  const query = `
  SELECT b.bill_id, b.due_date, b.billing_period_start, b.billing_period_end, b.total_amount, b.payment_status,
         c.name, c.address, c.phone_number 
  FROM Bill AS b
  JOIN Customer AS c ON b.customer_id = c.customer_id
  WHERE b.bill_id = ?
`;

db.query(query, [billId], (err, results) => {
  if (err) {
    return res.status(500).json({ error: 'An error occurred while fetching the bill.' });
  }

  if (results.length === 0) {
    return res.status(404).json({ message: 'No bill found with this ID.' });
  }

  res.json(results[0]); 
});
})

router.get('/customer/all/:customerId', (req, res) => {
  const customer_id = req.params.customerId;  
  
  const query = `
    SELECT b.bill_id, b.due_date, b.billing_period_start, b.billing_period_end, b.total_amount, b.payment_status,
           c.name, c.address, c.phone_number 
    FROM Bill AS b
    JOIN Customer AS c ON b.customer_id = c.customer_id
    WHERE b.customer_id = ?
  `;

  db.query(query, [customer_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while fetching the bills.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No bills found for this customer.' });
    }

    res.json(results); 
});
})

// Get all bills
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Bill'; // Query to fetch all bills
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while fetching the bills.' });
    }
    res.json(results); // Send all bills as response
  });
});

module.exports = router;
