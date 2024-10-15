const express = require('express');
const router = express.Router();
const db = require('../db');

// Get bill for a specific customer
router.get('/:customerId', (req, res) => {
  const customerId = req.params.customerId;

  const billQuery = `
    SELECT 
        c.name AS customer_name,
        c.address,
        c.phone_number,
        b.bill_id,
        b.amount,
        b.date
    FROM 
        Bill b 
    JOIN 
        Customer c ON b.customer_id = c.customer_id
    WHERE 
        c.customer_id = ?
  `;

  db.query(billQuery, [customerId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).send('Bill not found for this customer');
    }

    const billData = results[0];

    // Render bill as HTML
    const billHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bill</title>
          <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 8px 12px; border: 1px solid #ddd; }
              th { background-color: #f2f2f2; }
              @media print { 
                  @page { size: auto; margin: 0; } 
              }
          </style>
      </head>
      <body>
          <h1>Billing Statement</h1>
          <p><strong>Customer Name:</strong> ${billData.customer_name}</p>
          <p><strong>Address:</strong> ${billData.address}</p>
          <p><strong>Phone Number:</strong> ${billData.phone_number}</p>
          <p><strong>Bill ID:</strong> ${billData.bill_id}</p>
          <p><strong>Amount Due:</strong> $${billData.amount.toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(billData.date).toLocaleDateString()}</p>
          <script>
              window.onload = function() {
                  window.print();
              }
          </script>
      </body>
      </html>
    `;

    res.send(billHTML);
  });
});

module.exports = router;
