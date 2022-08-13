import type { SocketServer } from '@shared/types/socket';
import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import * as ip from 'ip';
import * as os from 'os';
import type { F } from 'ts-toolbelt';

const exposedAPI = {
  ioServer: {
    start: (
      options: Pick<SocketServer.Config, 'port'> & Pick<SocketServer.Info, 'hostname'>
    ) => defineAPIOfInvoke('socket-server:start-server', options),
    close: () => defineAPIOfInvoke('socket-server:close-server')
  },
  ioClient: {
    connect: (address: string, hostname: string) =>
      defineAPIOfInvoke('socket-client:connect', address, hostname),
    close: () => defineAPIOfInvoke('socket-client:close')
  },
  getLocalDeviceInfo: (): {
    ip: string;
    hostname: string;
  } => {
    return {
      hostname: os.hostname(),
      ip: ip.address()
    };
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
