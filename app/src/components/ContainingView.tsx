import React from 'react';

import { ISingleAnyChildProps, useLocation } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, Image, LinkBase, ResponsiveHidingView, ScreenSize, Stack, Text } from '@kibalabs/ui-react';
import { useWeb3Account, useWeb3ChainId } from '@kibalabs/web3-react';

import { AccountView } from './AccountView';

interface IContainingViewProps extends ISingleAnyChildProps {
  className?: string;
}

export function ContainingView(props: IContainingViewProps): React.ReactElement {
  const chainId = useWeb3ChainId();
  const account = useWeb3Account();
  const isLoggedIn = chainId != null && account != null;
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';
  const isConnected = chainId != null && account != null;

  const getPageName = (): string => {
    if (location.pathname === '/') {
      return 'Home';
    }
    if (location.pathname === '/chat') {
      return 'Chat';
    }
    return '';
  };

  const onMenuClicked = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Box className={props.className} zIndex={1} position='absolute' isFullWidth={true} isFullHeight={true}>
      <Stack direction={Direction.Vertical} isFullWidth={true} isFullHeight={true} contentAlignment={Alignment.Start} childAlignment={Alignment.Center}>
        {isConnected && (
          <Box variant='navBar' zIndex={999} shouldClipContent={true} isFullWidth={true}>
            <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullHeight={true} shouldAddGutters={true}>
              <LinkBase target='/'>
                <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} shouldAddGutters={true}>
                  <Image source='/assets/icon.png' alternativeText='logo' height='32px' fitType='contain' />
                  {!isChatPage && (
                    <Text variant='bold-large'>FlashBlock Speed Challenge</Text>
                  )}
                </Stack>
              </LinkBase>
              <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
                <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                  <Box shouldClipContent={true}>
                    <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center}>
                      <Button variant='navBarLocation' text={getPageName()} onClicked={onMenuClicked} />
                    </Stack>
                  </Box>
                </ResponsiveHidingView>
              </Stack.Item>
              <Stack.Item growthFactor={1} shrinkFactor={1} />
              {isLoggedIn && (
                <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
                  <AccountView address={account.address} />
                </ResponsiveHidingView>
              )}
            </Stack>
          </Box>
        )}
        <Stack.Item growthFactor={1} shrinkFactor={0} shouldShrinkBelowContentSize={false}>
          <Box variant='empty' shouldClipContent={true} isScrollableVertically={false} isFullWidth={true}>
            {props.children}
          </Box>
        </Stack.Item>
      </Stack>
    </Box>
  );
}
