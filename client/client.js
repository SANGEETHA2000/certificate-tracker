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
      certificateResult.textContent = JSON.stringify(result, null, 2);

      // Extract the valid_until value
      const validUntil = result.valid_until;
    
  
    // Get the notification form and result div
    const notificationForm = document.getElementById('notification-form');
    const notificationResult = document.getElementById('notification-result');
  
    // Add an event listener to the notification form
    notificationForm.addEventListener('submit', async (event) => {
      // Prevent the form from submitting
      event.preventDefault();
  
      // Get the email from the form
      const email = notificationForm.elements['email'].value;
      console.log(email, domain, validUntil)
      // Make the API request
      const response = await fetch('/api/add-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email,  domain: domain, expiryDate: validUntil })
      });
      const result = await response.json();
  
      // Display the result
      notificationResult.textContent = JSON.stringify(result, null, 2);
    });
  });
});
  