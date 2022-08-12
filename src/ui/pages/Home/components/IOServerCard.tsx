import { Button, TextInput } from '@mantine/core';
import { useSetState } from 'ahooks';
import { memo } from 'react';
import { tw } from 'twind';

import { useSocketStore } from '../store';

interface IOServerCardProps {}

function IOServerCard(props: IOServerCardProps): JSX.Element {
  const socketState = useSocketStore();
  const [{ serverPort }, setStates] = useSetState({
    serverPort: 8888
  });

  async function onCloseSocketServer() {
    await mainProcessAPI.ioServer.close();
  }

  async function onStartSocketServer() {
    const port = await mainProcessAPI.ioServer.start(serverPort);

    setStates({ serverPort: port });
  }

  return (
    <div className={tw`py-[10px]`}>
      <TextInput
        label="Server Port"
        variant="filled"
        radius="md"
        required
        value={serverPort}
        onChange={e => {
          setStates({ serverPort: +e.target.value });
        }}
      />
      <div className={tw`mt-[10px]`}>
        {socketState.server.status === 'started' ? (
          <Button onClick={onCloseSocketServer} fullWidth variant="light" color="red">
            Close
          </Button>
        ) : (
          <Button onClick={onStartSocketServer} fullWidth variant="light" color="teal">
            Open
          </Button>
        )}
      </div>
    </div>
  );
}

export default memo(IOServerCard);
