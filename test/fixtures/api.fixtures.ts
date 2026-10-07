export const currenciesFixture = [
  {
    id: '0199a1b2-0000-7000-8000-000000000001',
    code: 'USD',
    name: 'Dólar americano',
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
  },
  {
    id: '0199a1b2-0000-7000-8000-000000000002',
    code: 'BRL',
    name: 'Real brasileiro',
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
  },
];

export const convertFixture = {
  from: 'EUR',
  to: 'BRL',
  amount: 100,
  rate: 5.891304,
  result: 589.13,
  date: '2026-09-28',
};

export const latestRatesFixture = {
  base: 'BRL',
  date: '2026-09-28',
  rates: { USD: 0.188, EUR: 0.169741, JPY: 30.32 },
};

export const historyFixture = {
  from: 'USD',
  to: 'BRL',
  history: [
    { date: '2026-09-01', rate: 5.38 },
    { date: '2026-09-02', rate: 5.41 },
  ],
};

export const syncStatusFixture = {
  lastRun: {
    type: 'DAILY',
    status: 'SUCCESS',
    startedAt: '2026-09-29T09:00:00.000Z',
    finishedAt: '2026-09-29T09:00:02.000Z',
    rowsInserted: 45,
    error: null,
  },
  latestRateDate: '2026-09-28',
};
