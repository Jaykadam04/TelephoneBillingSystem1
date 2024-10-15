const express = require('express');
const router = express.Router();
const db = require('../db');
// Get all tariff plans
router.get('/', (req, res) => {
  const query = 'SELECT * FROM TariffPlans';

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
