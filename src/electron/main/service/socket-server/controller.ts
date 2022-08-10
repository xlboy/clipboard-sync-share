import { Server as ioServer } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { Socket as ClientSocket } from 'socket.io-client';
import { io as ioClient } from 'socket.io-client';

type SocketServerType = ioServer<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

type SocketClientType = ClientSocket<DefaultEventsMap, DefaultEventsMap>;

type StartedPort = number;

class IOServerController {
  private config = {
    port: 8888
  };
  private io: SocketServerType | null = null;

  start(config: { port: StartedPort }): StartedPort {
    this.config.port = config.port;

    if (this.isStartedStatus) {
      this.close();
    }

    this.io = this.startServer();

    return this.config.port;
  }

  close(): void {
    this.io?.close();
    this.io = null;
  }

  get isStartedStatus(): boolean {
    return this.io !== null;
  }

  private startServer(): SocketServerType {
    const io = new ioServer(this.config.port, {
      cors: {
        origin: '*'
      }
    });

    io.on('connection', socket => {
      console.log('访问了');
    });

    return io;
  }
}

class IOClientController {
  private io: SocketClientType | null = null;

  connect(address: string): Promise<void> {
    if (this.isConnectedStatus) {
      this.close();
    }

    // this.io = ioClient(address);
    this.io = ioClient('http://localhost:8888', {
      transports: ['websocket'],
      reconnection: false,
      timeout: 3000
    });

    this.io.on('connect_error', e => {
      console.log('e', e);
    });

    return new Promise(resolve => {
      this.io?.on('connect', () => {
        console.log('连接成功');

        // 连接成功的回调
        resolve();
      });
    });
  }

  close(): void {
    this.io?.close();
    this.io = null;
  }

  get isConnectedStatus(): boolean {
    return this.io !== null;
  }
}

export const ioServerController = new IOServerController();

export const ioClientController = new IOClientController();
