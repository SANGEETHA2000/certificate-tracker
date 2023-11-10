document.addEventListener('DOMContentLoaded', () => {
    // Get the certificate form and result div
    const certificateForm = document.getElementById('certificate-form');
    const certificateResult = document.getElementById('certificate-result');
  
    // Add an event listener to the certificate form
    certificateForm.addEventListener('submit', async (event) => {

        // Prevent the form from submitting
        event.preventDefault();
  
        // Get the domain from the form
        const domain = certificateForm.elements['domain'].value;

        // Make the API request
        const response = await fetch(`/api/domain-certificate?domain=${domain}`);
        const result = await response.json();

        // Display the result
        certificateResult.innerHTML = ''; // Clear previous content

        // Create and append elements for each property
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        // Domain Name
        const domainRow = tbody.insertRow();
        const domainCell1 = domainRow.insertCell(0);
        const domainCell2 = domainRow.insertCell(1);
        domainCell1.textContent = 'Domain Name';
        domainCell2.textContent = domain;

        // Valid From
        const validFromRow = tbody.insertRow();
        const validFromCell1 = validFromRow.insertCell(0);
        const validFromCell2 = validFromRow.insertCell(1);
        validFromCell1.textContent = 'Valid From';
        validFromCell2.textContent = result.valid_from;

        // Valid Until
        const validUntilRow = tbody.insertRow();
        const validUntilCell1 = validUntilRow.insertCell(0);
        const validUntilCell2 = validUntilRow.insertCell(1);
        validUntilCell1.textContent = 'Valid Until';
        validUntilCell2.textContent = result.valid_until;

        table.appendChild(tbody);
        certificateResult.appendChild(table);

        // Extract the valid_until value
        const validUntil = result.valid_until;
    
  
    // Get the notification form
    const notificationForm = document.getElementById('notification-form');
  
    // Add an event listener to the notification form
    notificationForm.addEventListener('submit', async (event) => {

        // Prevent the form from submitting
        event.preventDefault();
    
        // Get the email from the form
        const email = notificationForm.elements['email'].value;

        // Display a confirmation popup
        const isConfirmed = window.confirm(`Please confirm that you want to add the domain with email: ${email}`);
        
        if (isConfirmed) {
            
            // Make the API request
            const response = await fetch('/api/add-domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, domain: domain, expiryDate: validUntil })
            });

            // Check the response status
            if (response.ok) {
                // Display a success message
                window.alert('Domain Successfully Added');
            } else {
                // Display an error message
                window.alert('Failed to add domain. Please try again.');
            }
        }
      
    });
  });
});
  