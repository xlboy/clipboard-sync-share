import type { ClipboardType } from '@electron/service/clipboard-sync-share';
import { syncClipboardFromSocket } from '@electron/service/clipboard-sync-share';

class BaseController {
  protected readonly EventName = {
    'client-send-clipboard-to-global': '0aeff74e-13cc-56f4-b05c-7a6677187033',
    'client-receive-clipboard-from-global': '2538c3d3-6451-5079-bb4e-77adba52e4c4',
    'client-update-connected-info': 'b16f0f93-2b0e-5894-aee5-8be9c0ddfa19'
  } as const;
  constructor() {}

  protected syncClipboardFromSocket(
    clipboardType: ClipboardType,
    clipboardContent: Buffer
  ) {
    syncClipboardFromSocket(clipboardType, clipboardContent);
  }
}

export default BaseController;
