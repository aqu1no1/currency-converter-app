import { fireEvent, screen } from '@testing-library/react-native';

import { HomeSyncStatus } from '@components/home/HomeSyncStatus';
import type { SyncRunStatusDto } from '@dtos/sync-status.dto';
import { renderWithProviders } from '@test/utils/render-with-providers';

const RUN: SyncRunStatusDto = {
  type: 'DAILY',
  status: 'SUCCESS',
  startedAt: '2026-09-29T09:00:00.000Z',
  finishedAt: '2026-09-29T09:00:02.000Z',
  rowsInserted: 45,
  error: null,
};

describe('HomeSyncStatus', () => {
  it('shows when the rates were synced', async () => {
    await renderWithProviders(
      <HomeSyncStatus lastRun={RUN} hasError={false} quoteDate="2026-09-28" onPress={jest.fn()} />,
    );

    expect(screen.getByText('Sincronizado em 29/09 às 06:00')).toBeTruthy();
    expect(screen.queryByText('A última atualização falhou')).toBeNull();
  });

  it('warns with the date of the rates in use when the sync failed', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <HomeSyncStatus
        lastRun={{ ...RUN, status: 'FAILED', rowsInserted: 0, error: 'boom' }}
        hasError={false}
        quoteDate="2026-09-27"
        onPress={onPress}
      />,
    );

    expect(screen.getByText('A última atualização falhou')).toBeTruthy();
    expect(screen.getByText('Mostrando cotações de 27/09/2026')).toBeTruthy();
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
