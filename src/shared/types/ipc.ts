import type { SocketClient, SocketServer } from '@shared/types/socket';
import type { WebContents } from 'electron';

declare global {
  namespace IPCMainSubscribe {
    /**
     * IHMap = invoke-handle-map
     * 为 `invoke` 与 `handle` 交互方式定义的类型结构
     * */
    export interface IHMap {
      'socket-server:start-server': {
        args: [config: Pick<SocketServer.Config, 'port'>];
        return: SocketServer.Config['port'];
      };

      'socket-server:close-server': {
        args: [];
        return: void;
      };

      'socket-client:connect': {
        args: [address: string];
        return: void;
      };
      'socket-client:close': {
        args: [];
        return: void;
      };
    }

    export type IHChannel = keyof IHMap;
  }

  namespace IPCRendererSubscribe {
    /**
     * SOMap = send-on-map
     * 为 `send` 与 `on` 交互方式定义的类型结构
     * */
    export interface SOMap {
      'socket-server:status-change': {
        args: [status: SocketServer.Status];
      };
      'socket-client:status-change': {
        args: [status: SocketClient.Status];
      };
    }

    export type SOChannel = keyof SOMap;
  }

  namespace Electron {
    interface IpcMain {
      handle<
        C extends IPCMainSubscribe.IHChannel,
        Args extends IPCMainSubscribe.IHMap[C]['args'],
        Return extends IPCMainSubscribe.IHMap[C]['return']
      >(
        channel: C,
        listener: (event: IpcMainEvent, ...args: Args) => Return
      ): this;
    }

    interface IpcRenderer {
      invoke<
        C extends IPCMainSubscribe.IHChannel,
        Args extends IPCMainSubscribe.IHMap[C]['args'],
        Return extends IPCMainSubscribe.IHMap[C]['return']
      >(
        channel: C,
        listener: (event: IpcMainEvent, ...args: Args) => Return
      ): this;
    }
  }
}

export function ipcMainWebContentSend<Channel extends IPCRendererSubscribe.SOChannel>(
  webContent: WebContents
) {
  return <C extends Channel, Args extends IPCRendererSubscribe.SOMap[C]['args']>(
    channel: C,
    ...args: Args
  ) => webContent.send(channel, ...args);
}
