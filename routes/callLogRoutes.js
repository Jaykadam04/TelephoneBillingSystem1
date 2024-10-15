const express = require('express');
const router = express.Router();
const db = require('../db');
// Get call logs for a customer
router.get('/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const query = 'SELECT * FROM CallLogs WHERE customer_id = ?';

  db.query(query, [customerId], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});
// Add a call log
router.post('/', (req, res) => {
  const { customer_id, call_details, call_date } = req.body;
  const query = 'INSERT INTO CallLog (customer_id, call_details, call_date) VALUES (?, ?, ?)';

  db.query(query, [customer_id, call_details, call_date], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ message: 'Call log added successfully', call_log_id: result.insertId });
    }
  });
});


module.exports = router;
