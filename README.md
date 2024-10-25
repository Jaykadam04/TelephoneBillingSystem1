Telephone Billing System
A comprehensive telephone billing management system that allows users to manage customers, record call logs, generate bills, view tariff plans, and handle payments. Built with Node.js, Express, MySQL, and a Bootstrap-based frontend.

Features
Customer Management: Add, view, and search customers.
Tariff Plans: View all tariff plans and specific plan details.
Billing: Generate bills based on call duration, type, and plan rates.
Payments: Process payments for bills.
Reports: View customer call history and billing details.
Technologies
Frontend: HTML, CSS, JavaScript, Bootstrap
Backend: Node.js, Express
Database: MySQL
Project Setup
Prerequisites
MySQL for database management.
Node.js for backend server.
Installation
Clone the repository:
git clone https://github.com/Jaykadam04/TelephoneBillingSystem1.git
cd TelephoneBillingSystem1
Install dependencies:
npm install

Database Setup:

Import the MySQL database schema provided in db/schema.sql.
Update database credentials in config/db.js.
Run the Server:
node app.js
Usage
Frontend:
Open index.html in a browser.
API Endpoints:

Refer to each route's functionality for managing customers, call logs, bills, and payments.
Database Schema
Customer: Stores customer information.
CallLogs: Tracks call details (duration, type).
TariffPlan: Holds rate data.
Bill: Generates charges based on call logs and tariff plans.
Future Enhancements
Real-time notifications.
Enhanced analytics.
License
MIT

