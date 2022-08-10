import { ipcMain } from 'electron';

import { ioClientController, ioServerController } from './controller';

//#region  //*=========== socket-server ===========
ipcMain.handle('socket-server:get-current-open-status', () => {
  return ioServerController.isStartedStatus;
});

ipcMain.handle('socket-server:start-server', (_, { port }) => {
  const startedPort = ioServerController.start({ port });

  return startedPort;
});

ipcMain.handle('socket-server:close-server', () => {
  ioServerController.close();
});

//#endregion  //*======== socket-server ===========

//#region  //*=========== socket-client ===========
ipcMain.handle('socket-client:connect', async (_, address) => {
  await ioClientController.connect(address);
});

ipcMain.handle('socket-client:close', async () => {
  ioClientController.close();
});

ipcMain.handle('socket-client:get-status', async () => {
  return ioClientController.isConnectedStatus;
});
//#endregion  //*======== socket-client ===========
