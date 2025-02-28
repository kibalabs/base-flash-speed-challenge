import React from 'react';

import { Alignment, Box, Button, Direction, Image, PaddingSize, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';
import { useOnLinkWeb3AccountsClicked, useWeb3Account, useWeb3ChainId } from '@kibalabs/web3-react';

export function HomePage(): React.ReactElement {
  const chainId = useWeb3ChainId();
  const account = useWeb3Account();
  const onLinkAccountsClicked = useOnLinkWeb3AccountsClicked();
  const isConnected = chainId != null && account != null;

  React.useEffect((): (() => void) => {
    // eslint-disable-next-line no-console
    console.log('here1');
    const ws = new WebSocket('wss://sepolia.flashblocks.base.org/ws');
    // eslint-disable-next-line no-console
    console.log('ws', ws);
    ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('Connected to flashblocks websocket');
    };
    ws.onmessage = (event) => {
      // eslint-disable-next-line no-console
      console.log('Received flashblock message:', event);
    };
    ws.onerror = (error) => {
      console.error('Flashblock websocket error:', error);
    };
    ws.onclose = () => {
      // eslint-disable-next-line no-console
      console.log('Disconnected from flashblocks websocket');
    };
    return (): void => {
      // eslint-disable-next-line no-console
      console.log('here2');
      ws.close();
    };
  }, []);

  const onConnectWalletClicked = async () => {
    await onLinkAccountsClicked();
  };

  const onSwitchToBaseClicked = async () => {
    // @ts-expect-error
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${parseInt('8453', 10).toString(16)}` }],
    });
  };

  return (
    <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} isFullHeight={true} isFullWidth={true}>
      {!isConnected ? (
        <React.Fragment>
          <Image height='3rem' alternativeText='BaseLogo' source='/assets/logo/wordmark/Base_Wordmark_Blue.png' />
          <Spacing variant={PaddingSize.Wide} />
          <Text variant='header1' alignment={TextAlignment.Center}>FlashBlock Speed Challenge</Text>
          <Spacing variant={PaddingSize.Wide} />
          <Text variant='large'>Experience how insanely fast the new FlashBlocks are on Base</Text>
          <Spacing variant={PaddingSize.Wide3} />
          {chainId == null || account == null ? (
            <Button
              variant='tertiary-large'
              text='Connect Wallet'
              onClicked={onConnectWalletClicked}
            />
          ) : chainId !== 8453 ? (
            <React.Fragment>
              <Text variant='large'>Unsupported network, only base is supported</Text>
              <Spacing />
              <Button
                variant='tertiary-large'
                text='Switch to base'
                onClicked={onSwitchToBaseClicked}
              />
            </React.Fragment>
          ) : (
            <Text variant='large'>{`Connected to ${account.address}`}</Text>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box height='15em' width='15em'>
            <Button
              variant='primary-go'
              isFullHeight={true}
              isFullWidth={true}
              text='GO'
              onClicked={(): void => {}}
              contentAlignment={Alignment.Center}
              childAlignment={Alignment.Center}
            />
          </Box>
          <Spacing variant={PaddingSize.Wide2} />
          <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} maxWidth='600px'>
            <Text variant='large' alignment={TextAlignment.Center}>We&apos;re gonna test if you can sign a message faster than it can get included in a flashblock. The steps are simple:</Text>
            <Text variant='large' alignment={TextAlignment.Center}>1. Click the GO button</Text>
            <Text variant='large' alignment={TextAlignment.Center}>2. Check the message in your wallet<br />(always check what you sign!!)</Text>
            <Text variant='large' alignment={TextAlignment.Center}>3. Sign the message.</Text>
            <Text variant='large' alignment={TextAlignment.Center}>Our server will submit a transaction for you. The you watch it get included in a flashblock and then a full block.</Text>
            <Text variant='large' alignment={TextAlignment.Center}>Check your position on the leaderboard and share!</Text>
          </Stack>
        </React.Fragment>
      )}
    </Stack>
  );
}
