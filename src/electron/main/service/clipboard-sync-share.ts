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
  // TODO: file 尚未支持

  if (clipboardType) {
    shareClipboardBySocket(clipboardType, clipboardContent!);
  }
}, 500);

let lastTextWritten: string | undefined;
let lastImageWritten: Buffer | undefined;

export function syncClipboardFromSocket(
  clipboardType: ClipboardType,
  clipboardContent: Buffer
) {
  switch (clipboardType) {
    case 'image':
      const currentImageToWrite = clipboardContent;

      if (
        // 未写入过任何一张图片
        !lastImageWritten ||
        // 写入过图片，但「最后一次写入的图片」 与 「本次接收的图片」不一致
        (lastImageWritten && !lastImageWritten.equals(currentImageToWrite))
      ) {
        lastImageWritten = currentImageToWrite;
        clipboard.writeImage(nativeImage.createFromBuffer(lastImageWritten));
      }

      break;
    case 'text':
      const currentTextToWrite = clipboardContent.toString('utf8');

      if (currentTextToWrite !== lastTextWritten) {
        lastTextWritten = currentTextToWrite;
        clipboard.writeText(lastTextWritten);
      }

      break;
  }
}
