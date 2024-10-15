const mysql = require('mysql2');

// Create a MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Jaykadam@11', // Replace with your MySQL password
    database: 'telephone_billing_system'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Export the database connection
module.exports = db;
