import { createServer } from 'http';
import { Server } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

type SocketServerType = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

type StartedPort = number;

class SocketServerController {
  private config = {
    port: 10281
  };
  private io: SocketServerType | null = null;

  start(): StartedPort {
    const isNotClosed = this.io !== null;

    if (isNotClosed) {
      this.close();
    }

    this.io = this.startServer();

    return this.config.port;
  }

  close(): void {
    this.io?.close();

    this.io = null;
  }

  get currentStatus() {
    const isStartedStatus = this.io !== null;

    return isStartedStatus;
  }

  private startServer(): SocketServerType {
    const server = createServer();
    const io = new Server(server);

    io.listen(this.config.port);

    return io;
  }
}

export default new SocketServerController();
