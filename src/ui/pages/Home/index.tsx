import { SegmentedControl } from '@mantine/core';
import type { SocketClient } from '@shared/types/socket';
import React from 'react';
import './ipc';

import IOClientCard from './components/IOClientCard';
import IOServerCard from './components/IOServerCard';
import { useSocketStore } from './store';
import { useStyles } from './styles';

function HomePage(): JSX.Element {
  const styles = useStyles();
  const socketState = useSocketStore();

  const socketServerStarted = socketState.server.status === 'started';

  const socketClientInProgress = (
    ['connecting', 'connected'] as SocketClient.Status[]
  ).includes(socketState.client.status);

  return (
    <div className={styles['root-wrapper']}>
      <SegmentedControl
        color="grape"
        fullWidth
        value={socketState.currentMainService}
        data={[
          {
            label: 'Server',
            value: 'server',
            disabled: socketClientInProgress
          },
          {
            label: 'Client',
            value: 'client',
            disabled: socketServerStarted
          }
        ]}
        onChange={value => {
          socketState.updateCurrentMainService(value as any);
        }}
        radius="md"
      />

      {!socketClientInProgress && socketState.currentMainService === 'server' && (
        <IOServerCard />
      )}

      {!socketServerStarted && socketState.currentMainService === 'client' && (
        <IOClientCard />
      )}
    </div>
  );
}

export default React.memo(HomePage);
