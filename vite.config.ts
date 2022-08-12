import react from '@vitejs/plugin-react';
import { rmSync } from 'fs';
import { join, resolve } from 'path';
import { inspectorServer } from 'react-dev-inspector/plugins/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';

import pkg from './package.json';

removeDistDir();

const sharedAlias = {
  find: /@shared/,
  replacement: resolve(process.cwd(), './src/shared')
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /@ui/,
        replacement: resolve(process.cwd(), './src/ui')
      },
      sharedAlias
    ]
  },
  build: {
    minify: false
  },
  plugins: [
    react(),
    inspectorServer(),
    electron({
      main: {
        entry: 'src/electron/main/bootstrap.ts',
        vite: {
          resolve: {
            alias: [
              sharedAlias,
              {
                find: /@electron/,
                replacement: resolve(process.cwd(), './src/electron/main')
              }
            ]
          },
          build: {
            sourcemap: false,
            outDir: 'dist/electron/',
            minify: false,
            rollupOptions: {
              external: ['socket.io-client']
            }
          }
        }
      },
      preload: {
        input: {
          preload: join(__dirname, '/src/electron/main/preload/index.ts')
        },
        vite: {
          build: {
            sourcemap: 'inline',
            outDir: 'dist/electron/'
          }
        }
      },
      // Enables use of Node.js API in the Renderer-process
      renderer: {}
    })
  ],
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT
  }
});

function removeDistDir() {
  rmSync(join(__dirname, 'dist'), { recursive: true, force: true });
}
