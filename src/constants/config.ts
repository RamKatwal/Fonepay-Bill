export const AppConfig = {
  appName: 'Fonepay Digital Bill Generator',
  appTagline: 'Create Bill • Get Paid • Share',
  currencySymbol: 'Rs.',
  currencyCode: 'NPR',
  country: 'Nepal',

  // Pagination & Display limits
  dashboardRecentLimit: 10,
  historyPageSize: 10,

  // Prototype Delays (milliseconds)
  simulatedVerificationDelayMs: 2200,
  simulatedAuthDelayMs: 1200,
  simulatedShareDelayMs: 800,
} as const;
