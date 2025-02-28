import React from 'react';

import { Alignment, Box, Button, Direction, Image, MarkdownText, PaddingSize, Spacing, Stack, Text, TextAlignment } from '@kibalabs/ui-react';
import { useOnLinkWeb3AccountsClicked, useWeb3Account, useWeb3ChainId } from '@kibalabs/web3-react';

export function HomePage(): React.ReactElement {
  const chainId = useWeb3ChainId();
  const account = useWeb3Account();
  const onLinkAccountsClicked = useOnLinkWeb3AccountsClicked();
  const isConnected = chainId != null && account != null;
  const [messages, setMessages] = React.useState<string[]>([]);

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
    const reader = new FileReader();
    reader.onload = () => {
      // eslint-disable-next-line no-console
      console.log('Received flashblock blob message:', reader.result);
    };
    ws.onmessage = (event) => {
      // eslint-disable-next-line no-console
      console.log('Received flashblock message:', event.data);
      if (event.data instanceof Blob) {
        reader.readAsText(event.data);
      } else {
        // eslint-disable-next-line no-console
        console.log('Received flashblock text message:', event.data);
      }
      setMessages((prevMessages) => [...prevMessages, JSON.stringify(event.data)].slice(-10));
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
    <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} shouldAddGutters={true} isFullHeight={true} isFullWidth={true} isScrollableVertically={true}>
      <Box variant='tickerView'>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ animation: 'ticker 20s linear infinite', display: 'inline-block', whiteSpace: 'nowrap' }}>
            {messages.map((message) => (
              <Text key={message} variant='small'>{message}</Text>
            ))}
          </div>
        </div>
      </Box>
      {!isConnected ? (
        <React.Fragment>
          <Spacing variant={PaddingSize.Wide2} />
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
              onClicked={(): void => { }}
              contentAlignment={Alignment.Center}
              childAlignment={Alignment.Center}
            />
          </Box>
          <Spacing variant={PaddingSize.Wide2} />
          <Stack direction={Direction.Vertical} childAlignment={Alignment.Start} contentAlignment={Alignment.Start} shouldAddGutters={true} maxWidth='600px'>
            <Text variant='large' alignment={TextAlignment.Left}>We&apos;re gonna test if you can sign a message faster than it can get included in a flashblock. The steps are simple:</Text>
            <Text variant='large' alignment={TextAlignment.Left}>1. Click the GO button</Text>
            <Text variant='large' alignment={TextAlignment.Left}>2. Check the message in your wallet (always check what you sign!!)</Text>
            <Text variant='large' alignment={TextAlignment.Left}>3. Sign the message.</Text>
            <Text variant='large' alignment={TextAlignment.Left}>Our server will submit a transaction for you. The you watch it get included in a flashblock and then a full block.</Text>
            <Text variant='large' alignment={TextAlignment.Left}>Check your position on the leaderboard and share!</Text>
          </Stack>
          <Spacing variant={PaddingSize.Wide2} />
          <MarkdownText textVariant='note' source='Built with ❤️ by [@krishan711](https://twitter.com/krishan711) on behalf of [@TokenPage](https://www.tokenpage.xyz)' />
          <Spacing variant={PaddingSize.Wide} />
        </React.Fragment>
      )}
    </Stack>
  );
}
