export namespace SocketClient {
  export type Status = 'connected' | 'connecting' | 'disconnect';
}

export namespace SocketServer {
  export type Status = 'started' | 'not-started';

  export interface ConnectUserInfo {
    hostname: string;
    ip: string;
    status: 'online' | 'refuse-to-receive';
  }

  export interface Config {
    port: number;
  }
}
