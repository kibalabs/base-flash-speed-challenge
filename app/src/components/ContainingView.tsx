import React from 'react';

import { ISingleAnyChildProps, useLocation } from '@kibalabs/core-react';
import { Alignment, Box, Button, Direction, IconButton, Image, KibaIcon, LinkBase, ResponsiveHidingView, ScreenSize, Stack, Text } from '@kibalabs/ui-react';
import { useWeb3Account, useWeb3ChainId, useWeb3LoginSignature } from '@kibalabs/web3-react';

import { AccountView } from './AccountView';
import { LoadingIndicator } from './LoadingIndicator';

interface IContainingViewProps extends ISingleAnyChildProps {
  className?: string;
}

export function ContainingView(props: IContainingViewProps): React.ReactElement {
  const chainId = useWeb3ChainId();
  const account = useWeb3Account();
  const loginSignature = useWeb3LoginSignature();
  const isLoading = chainId === undefined || account === undefined || loginSignature === undefined;
  const isLoggedIn = chainId != null && account != null && loginSignature != null;
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
      {isLoading ? (
        <Stack direction={Direction.Vertical} isFullWidth={true} isFullHeight={true} contentAlignment={Alignment.Center} childAlignment={Alignment.Center}>
          <LoadingIndicator isLarge={true} />
        </Stack>
      ) : (
        <Stack direction={Direction.Vertical} isFullWidth={true} isFullHeight={true} contentAlignment={Alignment.Start} childAlignment={Alignment.Center}>
          {isConnected && (
            <Box variant='navBar' zIndex={999} shouldClipContent={true} isFullWidth={true}>
              <Stack direction={Direction.Horizontal} childAlignment={Alignment.Center} contentAlignment={Alignment.Center} isFullHeight={true} shouldAddGutters={true}>
                <LinkBase target='/'>
                  <Image source='/assets/icon.png' alternativeText='logo' height='32px' fitType='contain' />
                </LinkBase>
                {!isChatPage && (
                  <Text variant='bold-large'>FlashBlock Speed Challenge</Text>
                )}
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
                {isLoggedIn && (
                  <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                    <IconButton icon={<KibaIcon iconId='ion-menu-outline' />} label='Menu' onClicked={onMenuClicked} />
                  </ResponsiveHidingView>
                )}
              </Stack>
            </Box>
          )}
          {/* {isLoggedIn && (
            <HidingView isHidden={!isLoggedIn || !isMenuOpen}>
              <ResponsiveHidingView hiddenAbove={ScreenSize.Medium}>
                <Box variant='navBarMenu' zIndex={1000}>
                  <Stack direction={Direction.Vertical} isFullWidth={true}>
                    <Button variant={getVariant('sideBar', location.pathname === '/' ? 'sideBarSelected' : null)} text='Home' target='/' onClicked={onMenuClicked} />
                    <Button variant={getVariant('sideBar', location.pathname.startsWith('/chat') ? 'sideBarSelected' : null)} text='Chat' target='/chat' onClicked={onMenuClicked} />
                  </Stack>
                </Box>
              </ResponsiveHidingView>
            </HidingView>
          )} */}
          <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
            <Stack direction={Direction.Horizontal} childAlignment={Alignment.Start} contentAlignment={Alignment.Fill} shouldAddGutters={false} isFullWidth={true}>
              {/* {isLoggedIn && (
                <ResponsiveHidingView hiddenBelow={ScreenSize.Medium}>
                  <Box variant='sideBar' isFullHeight={true} width='250px'>
                    <Stack direction={Direction.Vertical} shouldAddGutters={false} isFullWidth={true}>
                      <Button variant={getVariant('sideBar', location.pathname === '/' ? 'sideBarSelected' : null)} text='Home' target='/' onClicked={onMenuClicked} />
                      <Button variant={getVariant('sideBar', location.pathname.startsWith('/chat') ? 'sideBarSelected' : null)} text='Chat' target='/chat' onClicked={onMenuClicked} />
                    </Stack>
                  </Box>
                </ResponsiveHidingView>
              )} */}
              <Stack.Item growthFactor={1} shrinkFactor={1} shouldShrinkBelowContentSize={true}>
                <Box variant='empty' shouldClipContent={true} isFullHeight={true} isScrollableVertically={false}>
                  {props.children}
                </Box>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      )}
    </Box>
  );
}
