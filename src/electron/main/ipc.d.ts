namespace IPCMainSubscribe {
  export interface Map {
    'socket-server:get-current-open-status': {
      args: [];
      return: boolean;
    };

    'socket-server:start-server': {
      args: [config: { port: number }];
      return: /* server-port */ number;
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
    'socket-client:get-status': {
      args: [];
      return: /* is-connected-status */ boolean;
    };
  }

  export type Channel = keyof Map;
}

declare namespace Electron {
  interface IpcMain {
    handle<
      C extends IPCMainSubscribe.Channel,
      Args extends IPCMainSubscribe.Map[C]['args'],
      Return extends IPCMainSubscribe.Map[C]['return']
    >(
      channel: C,
      listener: (event: IpcMainEvent, ...args: Args) => Return
    ): this;
  }

  interface IpcRenderer {
    invoke<
      C extends IPCMainSubscribe.Channel,
      Args extends IPCMainSubscribe.Map[C]['args'],
      Return extends IPCMainSubscribe.Map[C]['return']
    >(
      channel: C,
      listener: (event: IpcMainEvent, ...args: Args) => Return
    ): this;
  }
}
