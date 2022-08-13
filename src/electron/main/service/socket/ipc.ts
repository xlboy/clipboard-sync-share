import { ipcMain } from 'electron';

import clientController from './controller/client';
import serverController from './controller/server';

//#region  //*=========== server ===========

ipcMain.handle('socket-server:start-server', (_, options) => {
  const startedPort = serverController.start(options);

  return startedPort;
});

ipcMain.handle('socket-server:close-server', () => {
  serverController.close();
});

//#endregion  //*======== server ===========

//#region  //*=========== client ===========
ipcMain.handle('socket-client:connect', (_, address, hostname) => {
  clientController.connect(address, hostname);
});

ipcMain.handle('socket-client:close', () => {
  clientController.close();
});

// ipcMainWebContentSend(win.webContents)('socket-server:status-change');

//#endregion  //*======== client ===========
