function getData() {
    const rowData = [
      {
        domain: 'thorogood.com',
        issuer: 'Google',
        expiryDate: 'Jan 23 15:37:18 2024 GMT',
        isNotified: true,
        daysBeforeNotified: 30,
        email: "sangeetha2000.vd@gmail.com",
        inNotificationPeriod: false
      },
      {
        domain: 'google.com',
        issuer: 'Google',
        expiryDate: 'Dec  8 08:02:34 2023 GMT',
        isNotified: true,
        daysBeforeNotified: 60,
        email: "sangeetha2000.vd@gmail.com",
        inNotificationPeriod: true
      },
      {
        domain: 'dummy.com',
        issuer: 'Google',
        expiryDate: 'Nov  14 08:02:34 2023 GMT',
        isNotified: false,
        daysBeforeNotified: null,
        email: "sangeetha2000.vd@gmail.com",
        inNotificationPeriod: false
      }
    ]

    return rowData;
}

export default getData;