import { app, BrowserWindow, session, shell } from 'electron';
import { release } from 'os';
import { join } from 'path';
import './service';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win: BrowserWindow | null = null;

async function createWindow() {
  win = new BrowserWindow({
    title: 'clipboard-sync-app',
    webPreferences: {
      preload: join(__dirname, './preload.js'),
      nodeIntegration: true
    }
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../index.html'));
  } else {
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

    win.loadURL(url);
    win.webContents.openDevTools();

    app.commandLine.appendSwitch('ignore-certificate-errors');

    new BrowserWindow({
      title: 'clipboard-sync-app-page-2',
      webPreferences: {
        preload: join(__dirname, './preload.js'),
        nodeIntegration: true
      }
    }).loadURL(`${url}/page-2`);

    // win.hide();
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // setWebRequest();

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);

    return { action: 'deny' };
  });
}

function setWebRequest() {
  console.log('--setWebRequest--');
  const ses = session.defaultSession;

  ses.webRequest.onErrorOccurred(details => {
    console.log('--onErrorOccurred--', details.url);
    console.log(details.error);
  });

  ses.webRequest.onBeforeRequest((_details, callback) => {
    console.log('--onBeforeRequest--', _details.url);
    callback({ cancel: false });
  });

  ses.webRequest.onBeforeSendHeaders((_details, callback) => {
    console.log('--onBeforeSendHeaders--', _details.url);
    callback({ cancel: false });
  });

  ses.webRequest.onHeadersReceived((_details, callback) => {
    console.log('--onHeadersReceived--', _details.url);
    callback({ cancel: false });
  });

  ses.webRequest.onResponseStarted(_details => {
    console.log('--onResponseStarted--', _details.url);
  });

  ses.webRequest.onSendHeaders(_details => {
    console.log('--onSendHeaders--', _details.url);
  });

  ses.webRequest.onCompleted(_details => {
    console.log('--onCompleted--', _details.url);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;

  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();

  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
