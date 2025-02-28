import React from 'react';

import { Direction, Stack } from '@kibalabs/ui-react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.0);
  }
`;

const Dot = styled.div<{$delay: string; $isLarge?: boolean}>`
  width: ${(props) => (props.$isLarge ? '0.75em' : '0.5em')};
  height: ${(props) => (props.$isLarge ? '0.75em' : '0.5em')};
  background-color: var(--color-brand-primary);
  border-radius: 0;
  display: inline-block;
  margin: 0 ${(props) => (props.$isLarge ? '0.75em' : '0.5em')};
  animation: ${bounce} 2s infinite ease-in-out both;
  animation-delay: ${(props) => props.$delay};
`;

export interface ILoadingIndicatorProps {
  isLarge?: boolean;
}

export function LoadingIndicator(props: ILoadingIndicatorProps): React.ReactElement {
  return (
    <Stack direction={Direction.Horizontal} shouldAddGutters={false}>
      <Dot $isLarge={props.isLarge} $delay='-0.4s' />
      <Dot $isLarge={props.isLarge} $delay='-0.2s' />
      <Dot $isLarge={props.isLarge} $delay='-0s' />
    </Stack>
  );
}
