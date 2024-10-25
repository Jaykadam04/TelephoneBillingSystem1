const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to get all tariff plans
router.get('/tariffplans', (req, res) => {
    const query = 'SELECT * FROM TariffPlan';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching tariff plans' });
        }
        res.json(results);
    });
});


module.exports = router;
