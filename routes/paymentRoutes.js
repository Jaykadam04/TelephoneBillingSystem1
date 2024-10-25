const express = require('express');
const router = express.Router();
const db = require('../db');

// Make a payment
router.post('/', (req, res) => {
  const { customer_id, bill_id, amount } = req.body;

  // Input validation
  if (!customer_id || !bill_id || !amount || amount <= 0) {
    return res.status(400).send({ error: 'Invalid input. Please provide valid customer_id, bill_id, and amount greater than zero.' });
  }

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send({ error: 'Error starting transaction.' });
    }

    // Insert into Payment table
    const paymentQuery = 'INSERT INTO Payment (customer_id, bill_id, amount, payment_date) VALUES (?, ?, ?, NOW())';
    db.query(paymentQuery, [customer_id, bill_id, amount], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).send({ error: 'Error inserting payment into the Payment table.' });
        });
      }

      // Update the payment_status in the Bill table after successful payment
      const updateBillStatusQuery = 'UPDATE Bill SET payment_status = "Paid" WHERE bill_id = ?';
      db.query(updateBillStatusQuery, [bill_id], (updateErr, updateResult) => {
        if (updateErr) {
          return db.rollback(() => {
            res.status(500).send({ error: 'Error updating bill payment status.' });
          });
        }

        // Commit the transaction
        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              res.status(500).send({ error: 'Error committing transaction.' });
            });
          }

          // Respond with success message
          res.status(201).json({ message: 'Payment processed successfully, and bill marked as paid.', payment_id: result.insertId });
        });
      });
    });
  });
});

module.exports = router;
