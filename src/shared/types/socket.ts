export namespace SocketClient {
  export type Status = 'connected' | 'connecting' | 'disconnect';

  export type ConnectedInfoForWillUpdate = Omit<SocketServer.ConnectClientInfo, 'ip'>;
}

export namespace SocketServer {
  export type Status = 'started' | 'not-started';

  export interface ConnectClientInfo {
    hostname: string;
    ip: string;
    status: 'online' | 'refuse-to-receive';
  }

  export interface Info {
    hostname: string;
  }

  export interface Config {
    port: number;
  }
}
