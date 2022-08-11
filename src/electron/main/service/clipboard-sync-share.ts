import { clipboard, nativeImage } from 'electron';

import { shareClipboardBySocket } from './socket';

export type ClipboardType = 'text' | 'image' | 'files';

setInterval(() => {
  let clipboardType: ClipboardType | undefined;
  let clipboardContent: Buffer | undefined;

  const availableFormats = clipboard.availableFormats();
  const contentIsImageType = availableFormats.includes('image/png');
  const contentIsTextType = availableFormats.includes('text/plain');

  if (contentIsImageType) {
    clipboardType = 'image';
    clipboardContent = clipboard.readImage().toPNG();
  } else if (contentIsTextType) {
    clipboardType = 'text';
    clipboardContent = Buffer.from(clipboard.readText());
  }

  if (clipboardType) {
    shareClipboardBySocket(clipboardType, clipboardContent!);
  }
}, 500);

export function syncClipboardFromSocket(
  clipboardType: ClipboardType,
  clipboardContent: Buffer
) {
  switch (clipboardType) {
    case 'image':
      clipboard.writeImage(nativeImage.createFromBuffer(clipboardContent));
      break;
    case 'text':
      clipboard.writeText(clipboardContent.toString('utf8'));
      break;
  }
}
