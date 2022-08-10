import type { LocaleTypes } from '@ui/locales/types';
import _ from 'lodash';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AppStoreState {
  currentLocale: LocaleTypes;
}

interface AppStoreActions {
  setCurrentLocale(locale: AppStoreState['currentLocale']): void;
}

type Store = AppStoreState & AppStoreActions;

export const useAppStore = create<
  Store,
  [['zustand/persist', Store], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      currentLocale: 'zh-CN',

      //#endregion  //*======== state ===========
      //#region  //*=========== action ===========

      setCurrentLocale: locale =>
        set(state => {
          state.currentLocale = locale;
        })

      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-hotkey',
      partialize: state =>
        _.pick<any, keyof AppStoreState>(state, ['currentLocale']) as any
    }
  )
);
