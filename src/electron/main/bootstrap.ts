import { app, BrowserWindow, shell } from 'electron';
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

export function getWin(): BrowserWindow {
  return win!;
}

async function createWindow() {
  win = new BrowserWindow({
    title: 'clipboard-sync-app',
    width: 613,
    maxWidth: 613,
    maxHeight: 800,
    height: 800,
    x: 1920 - 613,
    y: 1080 - 800,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
      nodeIntegration: true
    }
  });

  const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../index.html'));

    win.webContents.openDevTools();
  } else {
    win.loadURL(url);
    win.webContents.openDevTools();

    // win.hide();
  }

  // Test active push message to Renderer-process
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);

    return { action: 'deny' };
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
