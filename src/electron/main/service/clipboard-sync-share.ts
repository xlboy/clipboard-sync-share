import { clipboard } from 'electron';

import { shareClipboardBySocket } from './socket';

export type ClipboardType = 'text' | 'image' | 'files';

setInterval(() => {
  const availableFormats = clipboard.availableFormats();

  const contentIsImageType = availableFormats.includes('image/png');

  if (contentIsImageType) {
    const clipboardImage = clipboard.readImage().toPNG();

    shareClipboardBySocket('image', clipboardImage);
  }
}, 1000);

export function syncClipboardFromSocket(
  clipboardType: ClipboardType,
  clipboardContent: Buffer
) {
  if (clipboardType === 'image') {
    console.log('真就丢个图片给我呗…人傻了');
  }
}
