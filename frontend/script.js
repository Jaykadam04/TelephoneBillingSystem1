const apiBaseURL = "http://localhost:3001";

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

function getBills() {
    const customerId = document.getElementById('customerIdInput').value;
    if (customerId) {
        fetch(`${apiBaseURL}/bills/customer1/${customerId}`)
            .then(response => response.json())
            .then(bills => {
                const billsList = document.getElementById('bills-list');
                billsList.innerHTML = '';
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
                        <strong>Due Date:</strong> ${bill.bill_date} <br>
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
        document.getElementById('customerForm').reset();
    })
    .catch(error => console.error('Error adding customer:', error));
});

function loadAllTariffPlans() {
    fetch('http://localhost:3001/tariffplans')
        .then(response => response.json())
        .then(data => {
            const tariffList = document.getElementById('tariff-list');
            tariffList.innerHTML = '';
            data.forEach(plan => {
                const planItem = document.createElement('li');
                planItem.innerHTML = `
                    <strong>Plan ID:</strong> ${plan.plan_id} <br>
                    <strong>Plan Name:</strong> ${plan.plan_name} <br>
                    <strong>Local Rate:</strong> ${plan.local_rate} <br>
                    <strong>International Rate:</strong> ${plan.international_rate} <br><br>
                `;
                tariffList.appendChild(planItem);
            });
        })
        .catch(error => console.error('Error loading tariff plans:', error));
}

function loadTariffPlanById(planId) {
    fetch(`http://localhost:3001/tariffplans/${planId}`)
        .then(response => response.json())
        .then(data => {
            const tariffPlanDetails = document.getElementById('tariffPlanDetails');
            tariffPlanDetails.innerHTML = '';
            if (data) {
                const planItem = document.createElement('div');
                planItem.innerHTML = `
                    <strong>Plan ID:</strong> ${data.plan_id} <br>
                    <strong>Plan Name:</strong> ${data.plan_name} <br>
                    <strong>Local Rate:</strong> ${data.local_rate} <br>
                    <strong>National Rate:</strong> ${data.national_rate} <br>
                    <strong>International Rate:</strong> ${data.international_rate} <br><br>
                `;
                tariffPlanDetails.appendChild(planItem);
            } else {
                tariffPlanDetails.innerHTML = 'No plan found for the given ID';
            }
        })
        .catch(error => console.error('Error loading tariff plan by ID:', error));
}

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
    fetch(`${apiBaseURL}/calllogs`, {
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

document.getElementById('paymentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const customer_id = document.getElementById('paymentCustomerID').value;
    const bill_id = document.getElementById('paymentBillID').value;
    const amount = document.getElementById('paymentAmount').value;
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
        document.getElementById('paymentForm').reset();
    })
    .catch(error => console.error('Error making payment:', error));
});

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

function loadCustomerBills() {
    const customer_id = document.getElementById('paymentCustomerID').value;
    if (!customer_id || isNaN(customer_id)) {
        alert("Please enter a valid customer ID.");
        return;
    }
    fetch(`${apiBaseURL}/bills/customer/${customer_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(bills => {
            const billSelect = document.getElementById('paymentBillID');
            billSelect.innerHTML = '';
            if (Array.isArray(bills)) {
                if (bills.length === 0) {
                    billSelect.innerHTML = '<option value="">No bills available</option>';
                } else {
                    bills.forEach(bill => {
                        const option = document.createElement('option');
                        option.value = bill.bill_id;
                        option.textContent = `Bill ID: ${bill.bill_id}, Amount: ${bill.total_amount}, Bill Date: ${bill.bill_date}`;
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
        });
}
