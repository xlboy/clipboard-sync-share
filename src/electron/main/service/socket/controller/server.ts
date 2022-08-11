import type { ServerSocket } from '@shared/types/socket';
import { Server } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

import BaseController from './base';
import type { ClipboardType } from '../../clipboard-sync-share';

class ServerController extends BaseController {
  private config: ServerSocket.Config = {
    port: 8888
  };
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null =
    null;

  start(config: Pick<ServerSocket.Config, 'port'>): ServerSocket.Config['port'] {
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

  shareClipboard(clipboardType: ClipboardType, clipboardContent: Buffer): void {
    this.io?.emit(
      this.EventName['client-receive-clipboard-from-global'],
      clipboardType,
      clipboardContent
    );
  }

  get isStartedStatus(): boolean {
    return this.io !== null;
  }

  private startServer(): typeof io {
    const io = new Server(this.config.port);

    io.on('connection', socket => {
      socket.on(
        this.EventName['client-send-clipboard-to-global'],
        (clipboardType: ClipboardType, clipboardContent: Buffer) => {
          this.syncClipboardFromSocket(clipboardType, clipboardContent);

          socket.broadcast.emit(
            this.EventName['client-receive-clipboard-from-global'],
            clipboardType,
            clipboardContent
          );
        }
      );
    });

    return io;
  }
}

const serverController = new ServerController();

export default serverController;
