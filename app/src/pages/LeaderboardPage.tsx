import React from 'react';

import { useNavigator } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, getVariant, PaddingSize, ResponsiveHidingView, ScreenSize, Spacing, Stack, Text } from '@kibalabs/ui-react';

import { AccountView } from '../components/AccountView';

interface LeaderboardEntry {
  address: string;
  requestDate: string;
  submitDate: string;
  flashBlockMillis: string;
  blockMillis: string;
  reactionMillis: number;
  blockNumber: number;
  transactionHash: string;
  position: number;
  ratio: number;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}

export function LeaderboardPage(): React.ReactElement {
  const [entries, setEntries] = React.useState<LeaderboardEntry[]>([]);
  const [orderBy, setOrderBy] = React.useState<string>('ratio');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const navigator = useNavigator();

  const loadLeaderboard = React.useCallback(async (selectedOrderBy: string): Promise<void> => {
    setIsLoading(true);
    try {
      const baseUrl = typeof window !== 'undefined' && window.KRT_API_URL ? window.KRT_API_URL : 'https://base-flash-speed-challenge-api.tokenpage.xyz';
      const response = await fetch(`${baseUrl}/v1/leaderboard?order_by=${selectedOrderBy}`);
      const data = await response.json() as LeaderboardResponse;
      setEntries(data.entries);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
    setIsLoading(false);
  }, []);

  React.useEffect((): void => {
    loadLeaderboard(orderBy);
  }, [loadLeaderboard, orderBy]);

  const onOrderByClicked = (selectedOrderBy: string) => (): void => {
    setOrderBy(selectedOrderBy);
  };

  return (
    <Stack direction={Direction.Vertical} isFullWidth={true} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
      <Spacing variant={PaddingSize.Wide2} />
      <Text variant='header2'>🏆 Leaderboard 🏆</Text>
      <Spacing variant={PaddingSize.Wide} />
      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true} shouldWrapItems={true} contentAlignment={Alignment.Center} defaultGutter={PaddingSize.Default}>
        <Button
          variant={orderBy === 'ratio' ? 'primary' : 'secondary'}
          text='By Ratio'
          onClicked={onOrderByClicked('ratio')}
        />
        <Button
          variant={orderBy === 'reaction_millis' ? 'primary' : 'secondary'}
          text='By Reaction'
          onClicked={onOrderByClicked('reaction_millis')}
        />
        <Button
          variant={orderBy === 'flash_block_millis' ? 'primary' : 'secondary'}
          text='By Flash Block'
          onClicked={onOrderByClicked('flash_block_millis')}
        />
        <Button
          variant={orderBy === 'submit_date' ? 'primary' : 'secondary'}
          text='Most Recent'
          onClicked={onOrderByClicked('submit_date')}
        />
      </Stack>
      <Spacing variant={PaddingSize.Wide} />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
          <Box variant='card' isScrollableVertically={true}>
            <Stack direction={Direction.Vertical} shouldAddGutters={true}>
              <Stack direction={Direction.Horizontal} childAlignment={Alignment.Start} shouldAddGutters={true}>
                <Box width='3em'><Text variant='bold'>#</Text></Box>
                <Box width='8em'><Text variant='bold'>Address</Text></Box>
                <ResponsiveHidingView hiddenBelow={ScreenSize.Small}>
                  <Box width='6em'><Text variant='bold'>Reaction</Text></Box>
                </ResponsiveHidingView>
                <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
                  <Box width='6em'><Text variant='bold'>Flash</Text></Box>
                </ResponsiveHidingView>
                <ResponsiveHidingView hiddenBelow={ScreenSize.Large}>
                  <Box width='6em'><Text variant='bold'>Block</Text></Box>
                </ResponsiveHidingView>
                <Box width='4em'><Text variant='bold'>Ratio</Text></Box>
              </Stack>
              {entries.map((entry: LeaderboardEntry) => (
                <Stack key={entry.transactionHash} direction={Direction.Horizontal} childAlignment={Alignment.Start} shouldAddGutters={true}>
                  <Box width='3em'>
                    <Text variant={getVariant('default', entry.position < 10 ? 'success' : entry.position < 100 ? 'mutedSuccess' : undefined)}>
                      #
                      {entry.position}
                    </Text>
                  </Box>
                  <Box width='8em'>
                    <AccountView address={entry.address} />
                  </Box>
                  <ResponsiveHidingView hiddenBelow={ScreenSize.Small}>
                    <Box width='6em'>
                      <Text variant={getVariant('default', entry.reactionMillis > 2000 ? 'error' : entry.reactionMillis > 1000 ? 'warning' : 'success')}>
                        {entry.reactionMillis}
                        ms
                      </Text>
                    </Box>
                  </ResponsiveHidingView>
                  <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
                    <Box width='6em'>
                      <Text variant='success'>
                        {entry.flashBlockMillis}
                        ms
                      </Text>
                    </Box>
                  </ResponsiveHidingView>
                  <ResponsiveHidingView hiddenBelow={ScreenSize.Large}>
                    <Box width='6em'>
                      <Text variant='success'>
                        {entry.blockMillis}
                        ms
                      </Text>
                    </Box>
                  </ResponsiveHidingView>
                  <Box width='4em'>
                    <Text variant={getVariant('default', Math.abs(entry.ratio - 1) < 2 ? 'success' : undefined)}>
                      {entry.ratio.toFixed(2)}
                    </Text>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack.Item>
      )}
      <Spacing variant={PaddingSize.Wide} />
      <Button
        variant='secondary'
        text='Back to Game'
        onClicked={(): void => navigator.navigateTo('/')}
      />
      <Spacing variant={PaddingSize.Wide2} />
    </Stack>
  );
}
