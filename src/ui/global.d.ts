/// <reference types="vite/client" />

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    ipcRenderer: import('electron').IpcRenderer;
    removeLoading: () => void;
  }
}

export {};
