const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    const query = 'SELECT * FROM TariffPlan';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching tariff plans' });
        }
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const planId = req.params.id;
    const query = 'SELECT * FROM TariffPlan WHERE plan_id = ?';
    
    db.query(query, [planId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: `Error fetching tariff plan with ID ${planId}` });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Tariff plan not found' });
        }

        res.json(results[0]);
    });
});

module.exports = router;
