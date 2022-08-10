import _ from 'lodash';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SettingStoreState {
  hostname: string;
  connectAddress: string;
}

interface SettingStoreActions {
  setHostname(hostname: string): void;
  setConnectAddress(connectAddress: string): void;
}

type Store = SettingStoreState & SettingStoreActions;

export const useSettingStore = create<
  Store,
  [['zustand/persist', Store], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      connectAddress: '',
      hostname: '-',
      //#endregion  //*======== state ===========

      //#region  //*=========== action ===========
      setConnectAddress: connectAddress =>
        set(state => {
          state.connectAddress = connectAddress;
        }),
      setHostname: hostname =>
        set(state => {
          state.hostname = hostname;
        })
      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-hotkey',
      partialize: state =>
        _.pick<any, keyof SettingStoreState>(state, ['connectAddress', 'hostname']) as any
    }
  )
);
