import { useSocketStore } from './store';

export {};

mainProcessAPI.registerIPCEvent('socket-client:status-change', (_, status) => {
  const { updateClientStatus } = useSocketStore.getState();

  updateClientStatus(status);
});

mainProcessAPI.registerIPCEvent('socket-server:status-change', (_, status) => {
  const { updateServerStatus } = useSocketStore.getState();

  updateServerStatus(status);
});
