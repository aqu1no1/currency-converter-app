import { screen } from '@testing-library/react-native';

import { HistoryEmpty } from '@components/history/HistoryEmpty';
import { HistorySummary } from '@components/history/HistorySummary';
import { renderWithProviders } from '@test/utils/render-with-providers';

describe('HistorySummary', () => {
  it('renders the title and each card', async () => {
    await renderWithProviders(
      <HistorySummary
        title="Resumo do período"
        items={[
          { label: 'Mínima', value: '5,3000', date: '10/09/2026' },
          { label: 'Máxima', value: '5,4500', date: '20/09/2026' },
        ]}
      />,
    );

    expect(screen.getByRole('header', { name: 'Resumo do período' })).toBeTruthy();
    expect(screen.getByText('5,3000')).toBeTruthy();
    expect(screen.getByText('20/09/2026')).toBeTruthy();
  });
});

describe('HistoryEmpty', () => {
  it('announces the empty period', async () => {
    await renderWithProviders(<HistoryEmpty title="Sem cotações" message="Tente outro período" />);

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Sem cotações')).toBeTruthy();
    expect(screen.getByText('Tente outro período')).toBeTruthy();
  });
});
