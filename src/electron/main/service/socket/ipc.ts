import { ipcMain } from 'electron';

import clientController from './controller/client';
import serverController from './controller/server';

//#region  //*=========== server ===========

ipcMain.handle('socket-server:start-server', (_, { port }) => {
  const startedPort = serverController.start({ port });

  return startedPort;
});

ipcMain.handle('socket-server:close-server', () => {
  serverController.close();
});

//#endregion  //*======== server ===========

//#region  //*=========== client ===========
ipcMain.handle('socket-client:connect', (_, address) => {
  clientController.connect(address);
});

ipcMain.handle('socket-client:close', () => {
  clientController.close();
});

// ipcMainWebContentSend(win.webContents)('socket-server:status-change');

//#endregion  //*======== client ===========
