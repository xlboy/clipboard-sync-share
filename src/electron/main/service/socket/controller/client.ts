import type { ClientSocket } from '@shared/types/socket';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
import type { Socket } from 'socket.io-client';
import { io as ioClient } from 'socket.io-client';

import BaseController from './base';
import type { ClipboardType } from '../../clipboard-sync-share';
import { syncClipboardFromSocket } from '../../clipboard-sync-share';

class ClientController extends BaseController {
  private io: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
  status: ClientSocket.Status = 'disconnect';

  connect(address: string) {
    if ((['connected', 'connecting'] as ClientSocket.Status[]).includes(this.status)) {
      this.close();
    }

    this.io = ioClient(address);
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
      console.log('已到 client-socket-share-clipboard，开传----「1」');

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
        console.log('已收到其他 global-client 分享的剪贴板内容，「3」');

        syncClipboardFromSocket(clipboardType, clipboardContent);
      }
    );
  }
}

const clientController = new ClientController();

export default clientController;
