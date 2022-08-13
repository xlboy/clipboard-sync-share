import { Badge, Divider, Kbd, SegmentedControl } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import type { SocketClient } from '@shared/types/socket';
import React from 'react';
import { tw } from 'twind';
import './ipc';

import ConnectInfoCard from './components/ConnectInfoCard';
import IOClientCard from './components/IOClientCard';
import IOServerCard from './components/IOServerCard';
import { useSocketStore } from './store';
import { useStyles } from './styles';

function HomePage(): JSX.Element {
  const styles = useStyles();
  const socketState = useSocketStore();
  const localIP = mainProcessAPI.getLocalIP();

  const socketServerStarted = socketState.server.status === 'started';
  const socketClientConnected = socketState.client.status === 'connected';

  const socketClientInProgress = (
    ['connecting', 'connected'] as SocketClient.Status[]
  ).includes(socketState.client.status);

  useHotkeys([
    [
      'shift+s',
      () => {
        if (!socketClientInProgress) {
          socketState.updateCurrentMainService('server');
        }
      }
    ],
    [
      'shift+c',
      () => {
        if (!socketServerStarted) {
          socketState.updateCurrentMainService('client');
        }
      }
    ]
  ]);

  return (
    <div className={styles['root-wrapper']}>
      <SegmentedControl
        color="grape"
        fullWidth
        value={socketState.currentMainService}
        data={[
          {
            label: (
              <div className={tw`w-full relative`}>
                Server
                {socketState.currentMainService !== 'server' && (
                  <div className={tw`absolute right-0 bottom-[1.5px]`}>
                    <Kbd className={tw`text-[10px] mr-[5px]`}>shift</Kbd>
                    <Kbd className={tw`text-[10px]`}>s</Kbd>
                  </div>
                )}
              </div>
            ),
            value: 'server',
            disabled: socketClientInProgress
          },
          {
            label: (
              <div className={tw`w-full relative`}>
                Client
                {socketState.currentMainService !== 'client' && (
                  <div className={tw`absolute right-0 bottom-[1.5px]`}>
                    <Kbd className={tw`text-[10px] mr-[5px]`}>shift</Kbd>
                    <Kbd className={tw`text-[10px]`}>c</Kbd>
                  </div>
                )}
              </div>
            ),
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

      {(socketServerStarted || socketClientConnected) && (
        <>
          <Divider my="sm" />
          <ConnectInfoCard />
        </>
      )}

      <Divider my="sm" />
      <div className={tw`w-full flex items-center justify-center`}>
        Local IP: <Badge className={tw`normal-case ml-[10px]`}>{localIP}</Badge>
      </div>
    </div>
  );
}

export default React.memo(HomePage);
