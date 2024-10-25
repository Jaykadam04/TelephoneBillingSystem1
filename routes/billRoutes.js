const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/customer1/:customerId', (req, res) => {
    const customer_id = req.params.customerId;
    const query = `
        SELECT b.bill_id, b.total_amount, b.bill_date, b.payment_status
        FROM Bill b
        WHERE b.customer_id = ?
    `;
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while fetching bills.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No bills found for this customer.' });
        }
        res.json(results);
    });
});

router.get('/customer/:customerId', (req, res) => {
    const customer_id = req.params.customerId;
    const query = `
        SELECT b.bill_id, b.total_amount, b.bill_date 
        FROM Bill b
        WHERE b.customer_id = ?
    `;
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while fetching bills.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No bills found for this customer.' });
        }
        res.json(results);
    });
});

router.get('/:billId', (req, res) => {
    const bill_id = req.params.billId;
    const query = `
        SELECT b.bill_id, b.total_amount, b.bill_date, b.payment_status,
               c.name, c.address, c.phone_number 
        FROM Bill b
        JOIN Customer c ON b.customer_id = c.customer_id
        WHERE b.bill_id = ?
    `;
    db.query(query, [bill_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while fetching the bill.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No bill found with this ID.' });
        }
        res.json(results[0]);
    });
});

module.exports = router;
