import type { MantineColor } from '@mantine/core';
import { Button, Loader, TextInput } from '@mantine/core';
import { useSetState } from 'ahooks';
import { memo } from 'react';
import { tw } from 'twind';

import { useSocketStore } from '../store';

interface IOClientCardProps {}

function IOClientCard(props: IOClientCardProps): JSX.Element {
  const socketState = useSocketStore();
  const [{ connectAddress }, setStates] = useSetState({
    connectAddress: 'http://localhost:8888'
  });

  async function onCloseClientSocket() {
    await mainProcessAPI.ioClient.close();
  }

  async function onConnectClientSocket() {
    if (connectAddress) {
      mainProcessAPI.ioClient.connect(connectAddress);
    } else {
      alert('Please enter connect address');
    }
  }

  async function onCancelClientSocket() {
    await mainProcessAPI.ioClient.close();
  }

  return (
    <div className={tw`py-[10px]`}>
      <TextInput
        label="Connect Address"
        color="secondary"
        variant="filled"
        value={connectAddress}
        required
        onChange={e => {
          setStates({ connectAddress: e.target.value });
        }}
      />

      <div className={tw`mt-[10px]`}>
        {socketState.client.status === 'connected' ? (
          <Button onClick={onCloseClientSocket} color="red" fullWidth variant="light">
            Disconnect
          </Button>
        ) : (
          (isConnectingStatus => {
            const color: MantineColor = isConnectingStatus ? 'yellow' : 'teal';

            return (
              <Button
                onClick={
                  isConnectingStatus ? onCancelClientSocket : onConnectClientSocket
                }
                color={color}
                fullWidth
                variant="light"
                rightIcon={isConnectingStatus ? <Loader size="sm" color={color} /> : null}
              >
                {isConnectingStatus ? 'Cancel' : 'Connect'}
              </Button>
            );
          })(socketState.client.status === 'connecting')
        )}
      </div>
    </div>
  );
}

export default memo(IOClientCard);
