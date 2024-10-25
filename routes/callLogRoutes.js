const express = require('express');
const router = express.Router();
const db = require('../db');

// Add Call Log and Generate Bill
router.post('/', (req, res) => {
    const { customer_id, plan_id, duration, call_type } = req.body;

    // Fetch the rate based on the tariff plan and call type
    const getRateQuery = `
        SELECT local_rate, international_rate FROM TariffPlan WHERE plan_id = ?
    `;
    db.query(getRateQuery, [plan_id], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Error fetching tariff rates.' });
        }
        
        if (results.length === 0) {
            return res.status(404).send({ error: 'Tariff plan not found.' });
        }

        const { local_rate, international_rate } = results[0];
        let rate = 0;
        if (call_type === 'local') {
            rate = local_rate;
        } else if (call_type === 'international') {
            rate = international_rate;
        } else {
            return res.status(400).send({ error: 'Invalid call type.' });
        }

        // Calculate the charge
        const charge = duration * rate;

        // Insert the call log
        const addCallLogQuery = `
            INSERT INTO CallLogs (customer_id, plan_id, duration, call_type)
            VALUES (?, ?, ?, ?)
        `;
        db.query(addCallLogQuery, [customer_id, plan_id, duration, call_type], (callLogErr, callLogResult) => {
            if (callLogErr) {
                return res.status(500).send({ error: 'Error adding call log.' });
            }

            // Generate and insert the bill
            const addBillQuery = `
                INSERT INTO Bill (customer_id, total_amount, bill_date, payment_status)
                VALUES (?, ?, NOW(), 'Unpaid')
            `;
            db.query(addBillQuery, [customer_id, charge], (billErr, billResult) => {
                if (billErr) {
                    return res.status(500).send({ error: 'Error generating bill.' });
                }

                res.status(201).send({
                    message: 'Call log added and bill generated successfully.',
                    bill_id: billResult.insertId,
                    charge: charge
                });
            });
        });
    });
});

module.exports = router;
