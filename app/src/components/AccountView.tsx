import React from 'react';

import { getClassName, truncateMiddle } from '@kibalabs/core';
import { Alignment, Box, Direction, IconButton, Image, KibaIcon, LinkBase, Stack, Text } from '@kibalabs/ui-react';
import { useWeb3, useWeb3Account, Web3Provider } from '@kibalabs/web3-react';


const nameCache: Map<string, string | null> = new Map();

const getEnsName = (address: string | null | undefined, web3: Web3Provider | undefined | null): Promise<string | null> => {
  if (!address) {
    return Promise.resolve(null);
  }
  if (nameCache.get(address)) {
    return Promise.resolve(nameCache.get(address) || null);
  }
  if (!address || !web3) {
    return Promise.resolve(null);
  }
  return web3.lookupAddress(address).then((retrievedOwnerName: string | null): string | null => {
    if (retrievedOwnerName) {
      nameCache.set(address, retrievedOwnerName);
    }
    return retrievedOwnerName;
  }).catch((): null => {
    return null;
  });
};

const useEnsName = (address: string | null | undefined): string | null => {
  const web3 = useWeb3();
  const [name, setName] = React.useState<string | null>(null);

  React.useEffect((): void => {
    setName(null);
    getEnsName(address, web3).then((value: string | null): void => {
      setName(value);
    });
  }, [address, web3]);

  return name;
};

export interface AccountImageViewProps {
  id?: string;
  className?: string;
  address: string;
  imageSize?: string;
}

export function AccountImageView(props: AccountImageViewProps): React.ReactElement {
  const imageSize = props.imageSize ?? '1em';
  return (
    <Box
      id={props.id}
      key={props.address}
      className={getClassName(props.className, AccountImageView.displayName)}
      variant='rounded'
      shouldClipContent={true}
      height={imageSize}
      width={imageSize}
    >
      <Image isLazyLoadable={true} source={`https://web3-images-api.kibalabs.com/v1/accounts/${props.address}/image`} alternativeText='.' />
    </Box>
  );
}
AccountImageView.displayName = 'AccountImageView';

export interface AccountViewProps {
  id?: string;
  className?: string;
  address: string;
  textVariant?: string;
  imageSize?: string;
  shouldUseYourAccount?: boolean;
  shouldShowCopyButton?: boolean;
}

export function AccountView(props: AccountViewProps): React.ReactElement {
  const account = useWeb3Account();
  const name = useEnsName(props.address);

  const defaultText = truncateMiddle(props.address, 10);
  const text = (props.shouldUseYourAccount && account?.address === props.address) ? 'Your profile' : (name ?? defaultText);

  const onCopyAddressClicked = (): void => {
    navigator.clipboard.writeText(props.address);
  };

  return (
    <Stack
      id={props.id}
      className={getClassName(props.className, AccountView.displayName)}
      key={props.address}
      direction={Direction.Horizontal}
      isFullWidth={false}
      isFullHeight={true}
      childAlignment={Alignment.Center}
      contentAlignment={Alignment.Start}
      shouldAddGutters={true}
    >
      <AccountImageView address={props.address} imageSize={props.imageSize} />
      <Text variant={props.textVariant}>{text}</Text>
      {props.shouldShowCopyButton && (
        <IconButton icon={<KibaIcon iconId='ion-copy-outline' variant='small' />} onClicked={onCopyAddressClicked} />
      )}
    </Stack>
  );
}
AccountView.displayName = 'AccountView';

export interface AccountViewLinkProps extends AccountViewProps {
  target: string;
}

export function AccountViewLink(props: AccountViewLinkProps): React.ReactElement {
  return (
    <LinkBase target={props.target} key={props.address} isFullWidth={false}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <AccountView {...props} className={getClassName(props.className, AccountViewLink.displayName)} />
    </LinkBase>
  );
}
AccountViewLink.displayName = 'AccountViewLink';
