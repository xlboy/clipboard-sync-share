import react from '@vitejs/plugin-react';
import { rmSync } from 'fs';
import { join, resolve } from 'path';
import { inspectorServer } from 'react-dev-inspector/plugins/vite';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';

import pkg from './package.json';

removeDistDir();

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /@ui/,
        replacement: resolve(process.cwd(), './src/ui')
      }
      // {
      //   find: 'xmlhttprequest-ssl',
      //   replacement: './node_modules/engine.io-client/lib/xmlhttprequest.js'
      // }
    ]
  },
  plugins: [
    react(),
    inspectorServer(),
    electron({
      main: {
        entry: 'src/electron/main/bootstrap.ts',
        vite: {
          build: {
            sourcemap: false,
            outDir: 'dist/electron/'
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
