import { getWin } from '@electron/bootstrap';
import type { ClipboardType } from '@electron/service/clipboard-sync-share';
import { ipcMainWebContentSend } from '@shared/types/ipc';
import type { SocketServer } from '@shared/types/socket';
import { Server } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

import BaseController from './base';

class ServerController extends BaseController {
  private config: SocketServer.Config = {
    port: 8888
  };
  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null =
    null;

  start(config: Pick<SocketServer.Config, 'port'>): SocketServer.Config['port'] {
    this.config.port = config.port;

    if (this.isStartedStatus) {
      this.close();
    }

    this.io = this.startServer();

    ipcMainWebContentSend(getWin().webContents)('socket-server:status-change', 'started');

    return this.config.port;
  }

  close(): void {
    this.io?.close();
    this.io = null;
    ipcMainWebContentSend(getWin().webContents)(
      'socket-server:status-change',
      'not-started'
    );
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
