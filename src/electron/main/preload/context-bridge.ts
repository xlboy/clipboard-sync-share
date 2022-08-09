import { contextBridge, ipcRenderer } from 'electron';

const exposedAPI = {
  socketServer: {
    getStatus: () => defineAPIOfInvoke('socket-server:get-current-open-status'),
    start: () => defineAPIOfInvoke('socket-server:start-server'),
    close: () => defineAPIOfInvoke('socket-server:close-server')
  }
} as const;

contextBridge.exposeInMainWorld('mainProcessAPI', exposedAPI);

type ContextBridgeAPI = typeof exposedAPI;

declare global {
  interface Window {
    mainProcessAPI: ContextBridgeAPI;
  }

  const mainProcessAPI: ContextBridgeAPI;
}

function defineAPIOfInvoke<
  Channel extends IPCMainSubscribe.Channel,
  Args extends IPCMainSubscribe.Map[Channel]['args'],
  Return extends IPCMainSubscribe.Map[Channel]['return']
>(channel: Channel, ...args: Args['length'] extends 0 ? [] : [Args]): Promise<Return> {
  return ipcRenderer.invoke(channel, args);
}
