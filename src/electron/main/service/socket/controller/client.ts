import { getWin } from '@electron/bootstrap';
import { ipcMainWebContentSend } from '@shared/types/ipc';
import type { SocketClient, SocketServer } from '@shared/types/socket';
import * as ip from 'ip';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { Socket } from 'socket.io-client';
import { io as ioClient } from 'socket.io-client';

import BaseController from './base';
import type { ClipboardType } from '../../clipboard-sync-share';

class ClientController extends BaseController {
  private io: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
  private _status: SocketClient.Status = 'disconnect';
  private info: SocketServer.ConnectClientInfo = {
    hostname: '',
    ip: ip.address(),
    status: 'online'
  };

  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
    ipcMainWebContentSend(getWin().webContents)('socket-client:status-change', status);
  }

  connect(address: string, hostname: string) {
    if ((['connected', 'connecting'] as SocketClient.Status[]).includes(this.status)) {
      this.close();
    }

    this.info.hostname = hostname;
    this.io = ioClient(address, {
      query: this.info
    });
    this.status = 'connecting';

    this.io?.on('connect', () => {
      this.status = 'connected';
    });

    this.io?.on('connect_error', error => {
      console.log('connect_error', error);

      if (this.status === 'connected') {
        this.status = 'disconnect';
      }
    });

    this.registerOtherEvents();
  }

  close(): void {
    this.io?.close();
    this.io = null;
    this.status = 'disconnect';
  }

  shareClipboard(clipboardType: ClipboardType, clipboardContent: Buffer): void {
    if (this.status === 'connected') {
      this.io?.emit(
        this.EventName['client-send-clipboard-to-global'],
        clipboardType,
        clipboardContent
      );
    }
  }

  registerOtherEvents() {
    this.io?.on(
      this.EventName['client-receive-clipboard-from-global'],
      (clipboardType: ClipboardType, clipboardContent: Buffer) => {
        this.syncClipboardFromSocket(clipboardType, clipboardContent);
      }
    );
  }
}

const clientController = new ClientController();

export default clientController;
