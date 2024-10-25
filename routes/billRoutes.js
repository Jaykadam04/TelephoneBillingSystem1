const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all bills for a specific customer by customer ID
router.get('/customer/:customerId', (req, res) => {
    const customer_id = req.params.customerId;

    // SQL query to fetch bills for the given customer_id
    const query = `
        SELECT b.bill_id, b.total_amount, b.due_date
        FROM Bill b
        WHERE b.customer_id = ?
    `;

    // Execute the query
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            // Return 500 if there's a server error
            return res.status(500).json({ error: 'An error occurred while fetching bills.' });
        }

        // If no bills are found for the customer
        if (results.length === 0) {
            return res.status(404).json({ message: 'No bills found for this customer.' });
        }

        // Return the array of bills
        res.json(results);
    });
});

// Get specific bill details by bill ID
router.get('/:billId', (req, res) => {
    const bill_id = req.params.billId;

    // SQL query to fetch the specific bill
    const query = `
        SELECT b.bill_id, b.total_amount, b.due_date, b.billing_period_start, b.billing_period_end, b.payment_status,
               c.name, c.address, c.phone_number 
        FROM Bill b
        JOIN Customer c ON b.customer_id = c.customer_id
        WHERE b.bill_id = ?
    `;

    // Execute the query
    db.query(query, [bill_id], (err, results) => {
        if (err) {
            // Return 500 if there's a server error
            return res.status(500).json({ error: 'An error occurred while fetching the bill.' });
        }

        // If no bill is found for the bill ID
        if (results.length === 0) {
            return res.status(404).json({ message: 'No bill found with this ID.' });
        }

        // Return the bill details
        res.json(results[0]);
    });
});

module.exports = router;
