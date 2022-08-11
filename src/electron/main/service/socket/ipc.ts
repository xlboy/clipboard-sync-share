import { ipcMain } from 'electron';

import clientController from './controller/client';
import serverController from './controller/server';

//#region  //*=========== server ===========
ipcMain.handle('socket-server:get-current-open-status', () => {
  return serverController.isStartedStatus;
});

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

ipcMain.handle('socket-client:get-status', () => {
  return clientController.status;
});
//#endregion  //*======== client ===========
