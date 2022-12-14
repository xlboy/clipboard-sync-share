import type { SocketClient, SocketServer } from '@shared/types/socket';
import _ from 'lodash';
import create from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface SocketStoreState {
  currentMainService: 'client' | 'server';
  currentConnectedInfo: {
    server: SocketServer.Info;
    clients: SocketServer.ConnectClientInfo[];
  };
  server: {
    status: SocketServer.Status;
    connectedUsers: SocketServer.ConnectClientInfo[];
  };
  client: {
    status: SocketClient.Status;
    connectInfo: Omit<SocketServer.ConnectClientInfo, 'status'>;
  };
}

interface SocketStoreActions {
  updateServerStatus(status: SocketServer.Status): void;
  updateServerConnectedUsers(users: SocketServer.ConnectClientInfo[]): void;

  updateClientStatus(status: SocketClient.Status): void;

  updateCurrentMainService(service: SocketStoreState['currentMainService']): void;

  updateCurrentConnectedInfo(
    currentConnectedInfo: SocketStoreState['currentConnectedInfo']
  ): void;
}

type Store = SocketStoreState & SocketStoreActions;

export const useSocketStore = create<
  Store,
  [
    ['zustand/subscribeWithSelector', Store],
    ['zustand/persist', Store],
    ['zustand/immer', Store]
  ]
>(
  subscribeWithSelector(
    persist(
      immer(set => ({
        //#region  //*=========== state ===========
        currentMainService: 'server',
        currentConnectedInfo: {
          clients: [],
          server: {
            hostname: '',
            ip: ''
          }
        },
        server: {
          connectedUsers: [],
          status: 'not-started'
        },
        client: {
          status: 'disconnect',
          connectInfo: {
            hostname: '',
            ip: ''
          }
        },
        //#endregion  //*======== state ===========
        //#region  //*=========== action ===========
        updateServerConnectedUsers: users =>
          set(state => {
            state.server.connectedUsers = users;
          }),
        updateServerStatus: status =>
          set(state => {
            state.server.status = status;
          }),
        updateClientStatus: status =>
          set(state => {
            state.client.status = status;
          }),
        updateCurrentMainService: service =>
          set(state => {
            state.currentMainService = service;
          }),
        updateCurrentConnectedInfo: currentConnectedInfo =>
          set(state => {
            state.currentConnectedInfo = currentConnectedInfo;
          })
        //#endregion  //*======== action ===========
      })),
      {
        name: 'bb-store-hotkey',
        partialize: state => _.pick<any, keyof SocketStoreState>(state, []) as any
      }
    )
  )
);

useSocketStore.subscribe(
  state => [state.client.status, state.server.status] as const,
  ([newClientStatus, newServerStatus]) => {
    const { updateCurrentMainService } = useSocketStore.getState();

    switch (newServerStatus) {
      case 'started':
        updateCurrentMainService('server');

        return;

      // ???1??? - server ????????????????????????????????? client
    }

    switch (newClientStatus) {
      // ???2??? - client ?????? ?????????????????? ??? ????????????????????? ????????????????????????????????? ?????????????????????main-service??????
      case 'connected':
      case 'connecting':
        updateCurrentMainService('client');

        return;
    }
  },
  {
    equalityFn(a, b) {
      return JSON.stringify(a) === JSON.stringify(b);
    },
    fireImmediately: true
  }
);
