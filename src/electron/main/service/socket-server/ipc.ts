import { ipcMain } from 'electron';

import controller from './controller';

ipcMain.handle('socket-server:get-current-open-status', () => {
  return controller.currentStatus;
});

ipcMain.handle('socket-server:start-server', () => {
  const startedPort = controller.start();

  return startedPort;
});

ipcMain.handle('socket-server:close-server', () => {
  controller.close();
});
