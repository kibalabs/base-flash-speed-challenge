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

export interface IFlashBlockTickerProps {
  className?: string;
}

export function FlashBlockTicker(props: IFlashBlockTickerProps): React.ReactElement {
  const [flashBlocks, setFlashBlocks] = React.useState<IFlashBlock[]>([]);
  const [blocks, setBlocks] = React.useState<IBlock[]>([]);
  const flashBlocksRef = React.useRef<IFlashBlock[]>([]);
  const blocksRef = React.useRef<IBlock[]>([]);

  const [flashBlockItems, setFlashBlockItems] = React.useState<Array<{ key: string; blockNumber: number; transactionCount: number; isNew: boolean }>>([]);
  const [blockItems, setBlockItems] = React.useState<Array<{ key: string; blockNumber: number; isNew: boolean }>>([]);

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
  }, [flashBlocksRef, blocksRef]);

  React.useEffect((): void => {
    const newItems = flashBlocks.map((flashBlock, index) => ({
      key: `${flashBlock.blockNumber}-${flashBlock.index}-${index}`,
      blockNumber: flashBlock.blockNumber,
      transactionCount: flashBlock.transactionCount,
      isNew: !flashBlockItems.some((item) => item.blockNumber === flashBlock.blockNumber && item.transactionCount === flashBlock.transactionCount),
    }));
    setFlashBlockItems(newItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashBlocks]);

  React.useEffect((): void => {
    const newItems = blocks.map((block, index) => ({
      key: `${block.blockNumber}-${index}`,
      blockNumber: block.blockNumber,
      isNew: !blockItems.some((item) => item.blockNumber === block.blockNumber),
    }));
    setBlockItems(newItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  React.useEffect((): (() => void) => {
    const timer = setTimeout((): void => {
      setFlashBlockItems((currentItems) => currentItems.map((item) => ({
        ...item,
        isNew: false,
      })));
    }, 100);
    return (): void => clearTimeout(timer);
  }, [flashBlockItems]);

  React.useEffect((): (() => void) => {
    const timer = setTimeout((): void => {
      setBlockItems((currentItems) => currentItems.map((item) => ({
        ...item,
        isNew: false,
      })));
    }, 100);
    return (): void => clearTimeout(timer);
  }, [blockItems]);

  return (
    <Stack className={props.className} direction={Direction.Vertical} childAlignment={Alignment.Center} shouldAddGutters={false} isFullWidth={true}>
      <Stack.Item gutterAfter={PaddingSize.None}>
        <Box variant='tickerView' isFullWidth={true}>
          {flashBlockItems.map((item): React.ReactElement => (
            <Box key={item.key} variant='tickerItem' isFullWidth={false}>
              <div
                style={{
                  opacity: item.isNew ? 0 : 1,
                  transform: item.isNew ? 'translateX(-50px)' : 'translateX(0)',
                  transition: 'opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <Text variant='small'>{`⚡️ ${item.blockNumber} (${item.transactionCount} txs)`}</Text>
              </div>
            </Box>
          ))}
        </Box>
      </Stack.Item>
      <Box variant='tickerView' isFullWidth={true}>
        {blockItems.map((item): React.ReactElement => (
          <Box key={item.key} variant='tickerItem' isFullWidth={false}>
            <div
              style={{
                opacity: item.isNew ? 0 : 1,
                transform: item.isNew ? 'translateX(-50px)' : 'translateX(0)',
                transition: 'opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <Text variant='small'>{`📦 ${item.blockNumber}`}</Text>
            </div>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
