const apiBaseURL = "http://localhost:3001";

// Function to fetch and display customers
function getCustomers() {
    fetch(`${apiBaseURL}/customers`)
        .then(response => response.json())
        .then(customers => {
            const customersList = document.getElementById('customers-list');
            customersList.innerHTML = '';
            customers.forEach(customer => {
                const customerCard = document.createElement('div');
                customerCard.classList.add('card', 'mb-3', 'p-3');
                customerCard.innerHTML = `
                    <strong>ID:</strong> ${customer.customer_id} <br>
                    <strong>Name:</strong> ${customer.name} <br>
                    <strong>Phone:</strong> ${customer.phone_number} <br>
                    <strong>Email:</strong> ${customer.email}
                `;
                customersList.appendChild(customerCard);
            });
        })
        .catch(error => console.error('Error fetching customers:', error));
}

// Function to fetch and display bills for a specific customer
function getBills() {
    const customerId = document.getElementById('customerIdInput').value;
    if (customerId) {
        fetch(`${apiBaseURL}/bills/customer/all/${customerId}`)
            .then(response => response.json())
            .then(bills => {
                console.log("bills",bills)
                const billsList = document.getElementById('bills-list');
                billsList.innerHTML = ''; // Clear previous bills

                if (bills.length === 0) {
                    billsList.innerHTML = '<p>No bills found for this customer.</p>';
                    return;
                }

                bills.forEach(bill => {
                    const billCard = document.createElement('div');
                    billCard.classList.add('card', 'mb-3', 'p-3');
                    billCard.innerHTML = `
                        <strong>Bill ID:</strong> ${bill.bill_id} <br>
                        <strong>Amount:</strong> ${bill.total_amount} <br>
                        <strong>Due Date:</strong> ${bill.due_date} <br>
                        <strong>Status:</strong> ${bill.payment_status}
                    `;
                    billsList.appendChild(billCard);
                });
            })
            .catch(error => console.error('Error fetching bills:', error));
    } else {
        alert('Please enter a customer ID');
    }
}

// Function to add a new customer
document.getElementById('customerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value;
    const address = document.getElementById('customerAddress').value;
    const phone = document.getElementById('customerPhone').value;
    const email = document.getElementById('customerEmail').value;

    const customerData = { name, address, phone_number: phone, email };

    fetch(`${apiBaseURL}/customers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Customer added successfully!');
        document.getElementById('customerForm').reset(); // Reset form after submission
    })
    .catch(error => console.error('Error adding customer:', error));
});

// Function to fetch and display tariff plans
function getTariffPlans() {
    fetch(`${apiBaseURL}/tariffplans`)
        .then(response => response.json())
        .then(tariffPlans => {
            console.log("traffic plans",tariffPlans)
            const tariffPlansList = document.getElementById('tariff-plans-list');
            tariffPlansList.innerHTML = '';
            tariffPlans.forEach(plan => {
                const planCard = document.createElement('div');
                planCard.classList.add('card', 'mb-3', 'p-3');
                planCard.innerHTML = `
                    <strong>Plan ID:</strong> ${plan.plan_id} <br>
                    <strong>Name:</strong> ${plan.plan_name} <br>
                    <strong>Rate:</strong> ${plan.monthly_rental}
                `;
                tariffPlansList.appendChild(planCard);
            });
        })
        .catch(error => console.error('Error fetching tariff plans:', error));
}

// Function to make a payment
document.getElementById('paymentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const customer_id = document.getElementById('paymentCustomerID').value;
    const amount = document.getElementById('paymentAmount').value;

    const paymentData = { customer_id, amount };

    fetch(`${apiBaseURL}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Payment successful!');
        document.getElementById('paymentForm').reset(); // Reset form after submission
    })
    .catch(error => console.error('Error making payment:', error));
});

// Function to search for a customer by name or phone number
function searchCustomer() {
    const query = document.getElementById('searchQuery').value;

    fetch(`${apiBaseURL}/customers/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(customer => {
            const searchResult = document.getElementById('search-result');
            searchResult.innerHTML = '';
            if (customer) {
                const customerCard = document.createElement('div');
                customerCard.classList.add('card', 'mb-3', 'p-3');
                customerCard.innerHTML = `
                    <strong>ID:</strong> ${customer.customer_id} <br>
                    <strong>Name:</strong> ${customer.name} <br>
                    <strong>Phone:</strong> ${customer.phone_number} <br>
                    <strong>Email:</strong> ${customer.email}
                `;
                searchResult.appendChild(customerCard);
            } else {
                searchResult.innerHTML = '<p>Customer not found</p>';
            }
        })
        .catch(error => console.error('Error searching customer:', error));
}

// Function to add a call log
document.getElementById('callLogForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const customer_id = document.getElementById('customerID').value;
    const call_details = document.getElementById('callDetails').value;
    const call_date = document.getElementById('callDate').value;

    const callLogData = { customer_id, call_details, call_date };

    fetch(`${apiBaseURL}/calllogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(callLogData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Call log added successfully!');
        document.getElementById('callLogForm').reset(); // Reset form after submission
    })
    .catch(error => console.error('Error adding call log:', error));
});
