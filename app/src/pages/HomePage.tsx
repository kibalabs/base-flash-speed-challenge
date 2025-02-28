import React from 'react';

import { dateToString } from '@kibalabs/core';
import { Alignment, Box, Button, Direction, getVariant, Image, MarkdownText, PaddingSize, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';
import { useOnLinkWeb3AccountsClicked, useWeb3Account, useWeb3ChainId } from '@kibalabs/web3-react';

import { FlashBlockTicker } from '../components/FlashBlockTicker';
import { LoadingIndicator } from '../components/LoadingIndicator';

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

const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_PARAMS = {
  chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}`,
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
};

export function HomePage(): React.ReactElement {
  const chainId = useWeb3ChainId();
  const account = useWeb3Account();
  const onLinkAccountsClicked = useOnLinkWeb3AccountsClicked();
  const isConnected = chainId === BASE_SEPOLIA_CHAIN_ID && account != null;
  const [currentEntry, setCurrentEntry] = React.useState<LeaderboardEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const onConnectClicked = React.useCallback((): void => {
    onLinkAccountsClicked();
  }, [onLinkAccountsClicked]);

  const onSwitchNetworkClicked = React.useCallback(async (): Promise<void> => {
    try {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_PARAMS.chainId }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // @ts-expect-error
      if (error.code === 4902) {
        try {
          // @ts-ignore
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_PARAMS],
          });
        } catch (addError) {
          console.error('Error adding Base Sepolia network:', addError);
        }
      } else {
        console.error('Error switching to Base Sepolia network:', error);
      }
    }
  }, []);

  const onGoClicked = React.useCallback(async (): Promise<void> => {
    if (!account || isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      const messageContent = {
        message: 'Base FlashBlocks are so damn fast!',
        requestTime: dateToString(new Date()),
      };
      const baseUrl = typeof window !== 'undefined' && window.KRT_API_URL ? window.KRT_API_URL : 'https://base-flash-speed-challenge-api.tokenpage.xyz';
      const signature = await account.signer.signMessage(JSON.stringify(messageContent, null, 2));
      const response = await fetch(`${baseUrl}/v1/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: JSON.stringify(messageContent, null, 2),
          signature,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit message');
      }
      const data = await response.json();
      setCurrentEntry(data.entry);
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [account, isSubmitting]);

  return (
    <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} isFullHeight={true} isFullWidth={true} isScrollableVertically={true}>
      <FlashBlockTicker />
      <Stack.Item growthFactor={1} shrinkFactor={1} />
      {!isConnected ? (
        <React.Fragment>
          <Spacing variant={PaddingSize.Wide2} />
          <Image height='3rem' alternativeText='BaseLogo' source='/assets/logo/wordmark/Base_Wordmark_Blue.png' />
          <Spacing variant={PaddingSize.Wide} />
          <Text variant='header1' alignment={TextAlignment.Center}>FlashBlock Speed Challenge</Text>
          <Spacing variant={PaddingSize.Wide} />
          <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} maxWidth='600px'>
            <Text variant='large' alignment={TextAlignment.Center}>We&apos;re gonna test if you can sign a message faster than it can get included in a flashblock.</Text>
            <Text variant='large' alignment={TextAlignment.Center}>Connect your wallet to get started.</Text>
          </Stack>
          <Spacing variant={PaddingSize.Wide} />
          {account == undefined ? (
            <Text>Please use this app on a browser with a wallet connected.</Text>
          ) : account == null ? (
            <Button
              variant='primary'
              text='Connect Wallet'
              onClicked={onConnectClicked}
            />
          ) : chainId !== BASE_SEPOLIA_CHAIN_ID && (
            <Button
              variant='primary'
              text='Switch to Base Sepolia'
              onClicked={onSwitchNetworkClicked}
            />
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Spacing variant={PaddingSize.Wide2} />
          { !isSubmitting && !currentEntry && (
            <Box height='15em' width='15em'>
              <Button
                variant='primary-go'
                isFullHeight={true}
                isFullWidth={true}
                text='GO'
                onClicked={onGoClicked}
                contentAlignment={Alignment.Center}
                childAlignment={Alignment.Center}
                isEnabled={!isSubmitting}
              />
            </Box>
          )}
          <Spacing variant={PaddingSize.Wide2} />
          { isSubmitting ? (
            <React.Fragment>
              <LoadingIndicator />
              <Text>Making transaction...</Text>
            </React.Fragment>
          ) : currentEntry == null ? (
            <Stack direction={Direction.Vertical} childAlignment={Alignment.Start} contentAlignment={Alignment.Start} shouldAddGutters={true} maxWidth='600px'>
              <Text variant='large' alignment={TextAlignment.Left}>We&apos;re gonna test if you can sign a message faster than it can get included in a flashblock. The steps are simple:</Text>
              <Text variant='large' alignment={TextAlignment.Left}>1. Click the GO button</Text>
              <Text variant='large' alignment={TextAlignment.Left}>2. Check the message in your wallet (always check what you sign!!)</Text>
              <Text variant='large' alignment={TextAlignment.Left}>3. Sign the message.</Text>
              <Text variant='large' alignment={TextAlignment.Left}>Our server will submit a transaction for you. Then you watch it get included in a flashblock and then a full block.</Text>
              <Text variant='large' alignment={TextAlignment.Left}>Check your position on the leaderboard and share!</Text>
            </Stack>
          ) : (
            <React.Fragment>
              <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} defaultGutter={PaddingSize.Wide}>
                  <Text variant='header2'>🏆</Text>
                  <Text variant='header2'>Results</Text>
                  <Text variant='header2'>🏆</Text>
                </Stack>
                <Spacing variant={PaddingSize.Wide} />
                <Box variant='card'>
                  <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                      <Text variant='header2'>Position:</Text>
                      <Text variant={getVariant('header2', currentEntry.position < 10 ? 'success' : currentEntry.position < 100 ? 'mutedSuccess' : null)}>
                        #
                        {currentEntry.position}
                      </Text>
                      {currentEntry.position === 1 && <Text variant='header2'>👑</Text>}
                    </Stack>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                      <Text variant='large-bold'>Ratio:</Text>
                      <Text variant={getVariant('large', Math.abs(currentEntry.ratio - 1) < 2 ? 'success' : undefined)}>
                        {currentEntry.ratio.toFixed(3)}
                      </Text>
                      <Text variant='large'>(closer to 1 is better)</Text>
                    </Stack>
                    <Spacing variant={PaddingSize.Wide} />
                    <Stack direction={Direction.Vertical} childAlignment={Alignment.Start} contentAlignment={Alignment.Start} shouldAddGutters={true}>
                      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true}>
                        <Text variant='large'>👇 Reaction time:</Text>
                        <Text variant={getVariant('large-bold', currentEntry.reactionMillis > 2000 ? 'error' : currentEntry.reactionMillis > 1000 ? 'warning' : 'success')}>
                          {currentEntry.reactionMillis}
                          ms
                        </Text>
                      </Stack>
                      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true}>
                        <Text variant='large'>⚡️ FlashBlock time:</Text>
                        <Text variant={getVariant('large-bold', 'success')}>
                          {currentEntry.flashBlockMillis}
                          ms
                        </Text>
                      </Stack>
                      <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true}>
                        <Text variant='large'>⛓️ Transaction time:</Text>
                        <Text variant={getVariant('large-bold', currentEntry.blockMillis > currentEntry.flashBlockMillis ? 'error' : 'success')}>
                          {currentEntry.blockMillis}
                          ms
                        </Text>
                      </Stack>
                    </Stack>
                    <Spacing variant={PaddingSize.Wide} />
                    <MarkdownText textVariant='large' source={`🔍 View on [Base Sepolia Explorer](https://sepolia.basescan.org/tx/${currentEntry.transactionHash})`} />
                  </Stack>
                </Box>
                <Spacing variant={PaddingSize.Wide} />
                <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true}>
                  <Button
                    variant='secondary'
                    text='Try Again'
                    onClicked={(): void => setCurrentEntry(null)}
                  />
                  <Button
                    variant='primary'
                    text='Share'
                    // iconLeft={<KibaIcon iconId='ion-logo-twitter' />}
                    onClicked={(): void => {
                      const text = '🏆 I just played @Base FlashBlock Speed Challenge!\n\n'
                        + `Position: #${currentEntry.position}\n`
                        + `Reaction time: ${currentEntry.reactionMillis}ms\n`
                        + `FlashBlock time: ${currentEntry.flashBlockMillis}ms\n\n`
                        + 'Try to beat me at https://base-flash-speed-challenge.tokenpage.xyz\n\n'
                        + '#baseflash with @krishan711';
                      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
                      window.open(tweetUrl, '_blank');
                    }}
                  />
                </Stack>
              </Stack>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      <Stack.Item growthFactor={1} shrinkFactor={1} />
      <Spacing variant={PaddingSize.Wide2} />
      <MarkdownText textVariant='note' source='Built with ❤️ by [@krishan711](https://twitter.com/krishan711) on behalf of [@TokenPage](https://www.tokenpage.xyz)' />
      <Spacing variant={PaddingSize.Wide} />
    </Stack>
  );
}
