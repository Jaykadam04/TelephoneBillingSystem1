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

// Function to load available tariff plans
function loadTariffPlans() {
    fetch(`${apiBaseURL}/tariffplans`)
        .then(response => response.json()) // Parse directly as JSON since we expect JSON response
        .then(tariffPlans => {
            const planSelect = document.getElementById('planID');
            planSelect.innerHTML = ''; // Clear any existing options

            // Populate the dropdown with tariff plan options
            tariffPlans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.plan_id;
                option.text = `${plan.plan_name} (Local: ${plan.local_rate}/min, International: ${plan.international_rate}/min)`;
                planSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading tariff plans:', error);
            alert('Failed to load tariff plans. Please try again later.');
        });
}

// Call this function on page load or when the relevant form is shown
window.onload = function() {
    loadTariffPlans();  // Automatically load plans when the page loads
};


// Function to add call log and generate bill
document.getElementById('callLogForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const customerID = document.getElementById('customerID').value;
    const planID = document.getElementById('planID').value;
    const duration = document.getElementById('duration').value;
    const callType = document.getElementById('callType').value;

    if (!planID) {
        alert('Please select a tariff plan.');
        return;
    }

    const callLogData = {
        customer_id: customerID,
        plan_id: planID,
        duration: duration,
        call_type: callType
    };

    fetch(`${apiBaseURL}/add-call-log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(callLogData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            alert(`Call log added and bill generated. Bill ID: ${data.bill_id}, Charge: ${data.charge}`);
        }
    })
    .catch(error => console.error('Error adding call log:', error));
});

// Function to make a payment
document.getElementById('paymentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const customer_id = document.getElementById('paymentCustomerID').value;
    const bill_id = document.getElementById('paymentBillID').value; // Ensure bill_id is captured
    const amount = document.getElementById('paymentAmount').value;

    // Ensure a bill is selected
    if (!bill_id) {
        alert("Please select a bill.");
        return;
    }

    const paymentData = { customer_id, bill_id, amount };

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

// Function to load bills for a customer
function loadCustomerBills() {
    const customer_id = document.getElementById('paymentCustomerID').value;

    // Check if customer_id is valid
    if (!customer_id || isNaN(customer_id)) {
        alert("Please enter a valid customer ID.");
        return;
    }

    fetch(`${apiBaseURL}/bills/customer/${customer_id}`)
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(bills => {
            const billSelect = document.getElementById('paymentBillID');
            billSelect.innerHTML = ''; // Clear previous options

            // Check if the response is an array before iterating
            if (Array.isArray(bills)) {
                if (bills.length === 0) {
                    // No bills available for this customer
                    billSelect.innerHTML = '<option value="">No bills available</option>';
                } else {
                    // Populate the dropdown with bill options
                    bills.forEach(bill => {
                        const option = document.createElement('option');
                        option.value = bill.bill_id;
                        option.textContent = `Bill ID: ${bill.bill_id}, Amount: ${bill.total_amount}, Due Date: ${bill.due_date}`;
                        billSelect.appendChild(option);
                    });
                }
            } else {
                alert('Unexpected response format from the server.');
            }
        })
        .catch(error => {
            console.error('Error fetching bills:', error);
            alert(`Error loading bills for the customer: ${error.message}`);

            // Clear the bill dropdown on error
            document.getElementById('paymentBillID').innerHTML = '<option value="">No bills available</option>';
        });
}
