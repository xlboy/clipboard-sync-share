import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import type { F } from 'ts-toolbelt';

const exposedAPI = {
  ioServer: {
    start: (port: number) => defineAPIOfInvoke('socket-server:start-server', { port }),
    close: () => defineAPIOfInvoke('socket-server:close-server')
  },
  ioClient: {
    connect: (address: string) => defineAPIOfInvoke('socket-client:connect', address),
    close: () => defineAPIOfInvoke('socket-client:close')
  },
  registerIPCEvent: <
    E extends IPCRendererSubscribe.SOChannel,
    Args extends IPCRendererSubscribe.SOMap[E]['args']
  >(
    eventName: E,
    callback: F.Function<[IpcRendererEvent, ...Args]>
  ) => ipcRenderer.on(eventName, callback as any)
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
  Channel extends IPCMainSubscribe.IHChannel,
  Args extends IPCMainSubscribe.IHMap[Channel]['args'],
  Return extends IPCMainSubscribe.IHMap[Channel]['return']
>(channel: Channel, ...args: Args['length'] extends 0 ? [] : Args): Promise<Return> {
  return ipcRenderer.invoke(channel, ...args);
}
