const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/generate/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id;

    // Get call logs for the customer
    const getCallLogsQuery = 'SELECT duration, call_type FROM CallLogs WHERE customer_id = ?';
    db.query(getCallLogsQuery, [customer_id], (err, callLogs) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching call logs.' });
        }

        // Fetch tariff plan for the customer
        const getTariffQuery = 'SELECT local_rate, international_rate FROM TariffPlan LIMIT 1';
        db.query(getTariffQuery, (tariffErr, tariffPlan) => {
            if (tariffErr || !tariffPlan.length) {
                return res.status(500).send({ error: 'Error fetching tariff plan.' });
            }

            const { local_rate, international_rate } = tariffPlan[0];
            let totalBillAmount = 0;

            // Calculate total charges based on call logs
            callLogs.forEach(log => {
                const rate = (log.call_type === 'local') ? local_rate : international_rate;
                totalBillAmount += log.duration * rate;
            });

            // Insert the bill into the Bill table
            const insertBillQuery = 'INSERT INTO Bill (customer_id, total_amount, payment_status, due_date) VALUES (?, ?, "Unpaid", DATE_ADD(NOW(), INTERVAL 30 DAY))';
            db.query(insertBillQuery, [customer_id, totalBillAmount], (billErr, billResult) => {
                if (billErr) {
                    return res.status(500).send({ error: 'Error generating bill.' });
                }
                res.status(201).json({ message: 'Bill generated successfully.', bill_id: billResult.insertId });
            });
        });
    });
});

module.exports = router;
