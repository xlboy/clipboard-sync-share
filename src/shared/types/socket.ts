export namespace ClientSocket {
  export type Status = 'connected' | 'connecting' | 'disconnect';
}

export namespace ServerSocket {
  export interface Config {
    port: number;
  }
}
