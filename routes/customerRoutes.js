const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const query = 'SELECT * FROM Customer';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

router.post('/', (req, res) => {
  const { name, address, phone_number, email } = req.body;
  const query = 'INSERT INTO Customer (name, address, phone_number, email) VALUES (?, ?, ?, ?)';

  db.query(query, [name, address, phone_number, email], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({ message: 'Customer added successfully', customer_id: result.insertId });
    }
  });
});

router.get('/search', (req, res) => {
  const queryParam = req.query.query;
  const query = `SELECT * FROM Customer WHERE name LIKE ? OR phone_number LIKE ? LIMIT 1`;

  db.query(query, [`%${queryParam}%`, `%${queryParam}%`], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    }
  });
});

module.exports = router;
