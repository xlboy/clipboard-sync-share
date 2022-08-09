import { clipboard } from 'electron';

type ContentType = 'text' | 'image' | 'files';

setInterval(() => {
  const availableFormats = clipboard.availableFormats();
  const contentIsImageType = availableFormats.includes('text/plain');

  if (contentIsImageType) {
    getImageContent();
  }
}, 1000);

function getImageContent() {}
