import React from 'react';

import { Alignment, Box, Direction, PaddingSize, Stack, Text } from '@kibalabs/ui-react';

interface IFlashBlock {
  index: number;
  blockNumber: number;
  transactionCount: number;
}

interface IBlock {
  blockNumber: number;
  transactionCount: number;
}

export function FlashBlockTicker(): React.ReactElement {
  const [blocks, setBlocks] = React.useState<IBlock[]>([]);
  const [flashBlocks, setFlashBlocks] = React.useState<IFlashBlock[]>([]);
  const flashBlocksRef = React.useRef<IFlashBlock[]>(flashBlocks);

  React.useEffect((): (() => void) => {
    const ws = new WebSocket('wss://sepolia.flashblocks.base.org/ws');
    ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('Connected to flashblock websocket');
    };
    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const blockData = JSON.parse(reader.result as string);
          const newFlashBlock: IFlashBlock = {
            index: blockData.index,
            blockNumber: blockData.metadata.block_number,
            transactionCount: blockData.diff.transactions.length,
          };
          setFlashBlocks((currentFlashBlocks) => [newFlashBlock, ...currentFlashBlocks.slice(0, 15)]);
          if (blockData.index === 0) {
            const relevantFlashBlocks = flashBlocksRef.current.filter((flashBlock) => flashBlock.blockNumber === blockData.metadata.block_number - 1);
            const newBlock: IBlock = {
              blockNumber: blockData.metadata.block_number - 1,
              transactionCount: relevantFlashBlocks.reduce((total, flashBlock) => total + flashBlock.transactionCount, 0),
            };
            setBlocks((currentBlocks) => [newBlock, ...currentBlocks.slice(0, 15)]);
          }
        };
        reader.readAsText(event.data);
      }
    };
    ws.onerror = (error) => {
      console.error('Flashblock websocket error:', error);
    };
    return (): void => {
      ws.close();
    };
  }, [flashBlocksRef]);

  return (
    <Stack direction={Direction.Vertical} childAlignment={Alignment.Center} shouldAddGutters={false} isFullWidth={true}>
      <Stack.Item gutterAfter={PaddingSize.None}>
        <Box variant='tickerView' isFullWidth={true}>
          {flashBlocks.map((flashBlock: IFlashBlock): React.ReactNode => (
            <Box key={`${flashBlock.blockNumber}#${flashBlock.index}`} variant='tickerItem' isFullWidth={false}>
              <Text variant='small'>{`⚡️ ${flashBlock.blockNumber}#${flashBlock.index} (${flashBlock.transactionCount} txs)`}</Text>
            </Box>
          ))}
        </Box>
      </Stack.Item>
      <Box variant='tickerView' isFullWidth={true}>
        {blocks.map((block: IBlock): React.ReactNode => (
          <Box key={`${block.blockNumber}`} variant='tickerItem' isFullWidth={false}>
            <Text variant='small'>{`📦 ${block.blockNumber}`}</Text>
          </Box>
        ))}
      </Box>
      {/* <style>
        {`
          @keyframes ticker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style> */}
    </Stack>
  );
}
