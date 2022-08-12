import type { SocketClient, SocketServer } from '@shared/types/socket';
import _ from 'lodash';
import create from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface SocketStoreState {
  currentMainService: 'client' | 'server';
  server: {
    status: SocketServer.Status;
    connectedUsers: SocketServer.ConnectUserInfo[];
  };
  client: {
    status: SocketClient.Status;
    connectInfo: Omit<SocketServer.ConnectUserInfo, 'status'>;
  };
}

interface SocketStoreActions {
  updateServerStatus(status: SocketServer.Status): void;
  updateServerConnectedUsers(users: SocketServer.ConnectUserInfo[]): void;

  updateClientStatus(status: SocketClient.Status): void;

  updateCurrentMainService(service: SocketStoreState['currentMainService']): void;
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

      // 「1」 - server 不启动？那就走下去看看 client
    }

    switch (newClientStatus) {
      // 「2」 - client 处于 「连接成功」 或 「正在连接中」 的话，则证明是在尝试着 「抢占主服务（main-service）」
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
