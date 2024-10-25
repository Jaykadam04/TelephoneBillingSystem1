const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Jaykadam@11', 
    database: 'telephone_billing_system'
});


db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});



module.exports = db;
