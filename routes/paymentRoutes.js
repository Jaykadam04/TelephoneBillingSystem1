const express = require('express');
const router = express.Router();
const db = require('../db');
// Get payment details for a customer
router.get('/bill/:billId', (req, res) => {
  const billId = req.params.billId;
  const query = 'SELECT * FROM Payment WHERE bill_id = ?';

  db.query(query, [billId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Make a payment
router.post('/', (req, res) => {
  const { customer_id, amount } = req.body;
  const query = 'INSERT INTO Payment (customer_id, amount) VALUES (?, ?)';

  db.query(query, [customer_id, amount], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ message: 'Payment processed successfully', payment_id: result.insertId });
    }
  });
});


module.exports = router;

