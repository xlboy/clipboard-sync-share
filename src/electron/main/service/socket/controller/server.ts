import { getWin } from '@electron/bootstrap';
import type { ClipboardType } from '@electron/service/clipboard-sync-share';
import { ipcMainWebContentSend } from '@shared/types/ipc';
import type { SocketClient, SocketServer } from '@shared/types/socket';
import { Server } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

import BaseController from './base';

class ServerController extends BaseController {
  private config: SocketServer.Config = {
    port: 8888
  };

  private info: SocketServer.Info = {
    hostname: ''
  };

  private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null =
    null;

  private connectedClient = new ConnectedClientPool();

  start(
    options: Pick<SocketServer.Config, 'port'> & Pick<SocketServer.Info, 'hostname'>
  ): SocketServer.Config['port'] {
    this.config.port = options.port;
    this.info.hostname = options.hostname;

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
    this.connectedClient.resetAll();
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
      const connectInfo = socket.handshake
        .query as unknown as SocketServer.ConnectClientInfo;

      console.log('connectInfo', connectInfo);

      this.connectedClient.join(connectInfo);
      this.updateCurrentConnectedInfo();

      socket.on('disconnect', reason => {
        this.connectedClient.leave(connectInfo.ip);
        this.updateCurrentConnectedInfo();
      });

      // 已连接的 client 要更改连接信息
      socket.on(
        this.EventName['client-update-connected-info'],
        (info: SocketClient.ConnectedInfoForWillUpdate) => {
          this.connectedClient.update(connectInfo.ip, info);
          this.updateCurrentConnectedInfo();
        }
      );

      // 某个 client 要进行实时分享
      socket.on(
        this.EventName['client-send-clipboard-to-global'],
        (clipboardType: ClipboardType, clipboardContent: Buffer) => {
          this.syncClipboardFromSocket(clipboardType, clipboardContent);

          // TODO: 待完善某些用户不希望被分享（即判断 status）
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

  private updateCurrentConnectedInfo() {
    // TODO: 代码待优化…
    // 刷新当前连接的 client 信息
    ipcMainWebContentSend(getWin().webContents)(
      'socket:connected-client-change',
      this.info,
      this.connectedClient.getAll()
    );
  }
}

abstract class IConnectedClientPool {
  abstract clients: SocketServer.ConnectClientInfo[];

  abstract join(clientInfo: SocketServer.ConnectClientInfo): void;

  abstract leave(clientIp: SocketServer.ConnectClientInfo['ip']): void;

  abstract update(
    clientIp: string,
    clientInfo: Pick<SocketServer.ConnectClientInfo, 'hostname' | 'status'>
  ): void;

  abstract getAll(): SocketServer.ConnectClientInfo[];

  abstract resetAll(): void;
}

class ConnectedClientPool implements IConnectedClientPool {
  clients: SocketServer.ConnectClientInfo[] = [];

  getAll(): SocketServer.ConnectClientInfo[] {
    return this.clients;
  }
  join(clientInfo: SocketServer.ConnectClientInfo): void {
    this.clients.push(clientInfo);
  }
  leave(clientIp: string): void {
    const leaveClientIndex = this.clients.findIndex(client => client.ip === clientIp);

    this.clients.splice(leaveClientIndex, 1);
  }
  update(
    clientIp: string,
    clientInfo: Pick<SocketServer.ConnectClientInfo, 'hostname' | 'status'>
  ): void {
    this.clients.forEach(client => {
      if (client.ip === clientIp) {
        Object.assign(client, clientInfo);
      }
    });
  }

  resetAll(): void {
    this.clients = [];
  }
}

const serverController = new ServerController();

export default serverController;
