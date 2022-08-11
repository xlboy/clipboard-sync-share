import './ipc';

import clientController from './controller/client';
import serverController from './controller/server';
import type { ClipboardType } from '../clipboard-sync-share';

export function shareClipboardBySocket(
  clipboardType: ClipboardType,
  clipboardContent: Buffer
) {
  const serverStarted = serverController.isStartedStatus;
  const clientConnected = clientController.status === 'connected';

  if (serverStarted) {
    serverController.shareClipboard(clipboardType, clipboardContent);
  } else if (clientConnected) {
    clientController.shareClipboard(clipboardType, clipboardContent);
  }
}
