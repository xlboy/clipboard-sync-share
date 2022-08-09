import { execaSync } from 'execa';
import path from 'path';

import tsConfigJSON from '../tsconfig.json';

void (function main() {
  return typeCheckByTSConfigPaths(getTSConfigPathsForCheck());

  function typeCheckByTSConfigPaths(tsConfigPaths: string[]) {
    tsConfigPaths.forEach(path =>
      execaSync('tsc', ['-p', path, '--noEmit', '--composite', 'false'])
    );
  }

  function getTSConfigPathsForCheck(): string[] {
    const rootPath = process.cwd();

    return tsConfigJSON.references.map(item => path.resolve(rootPath, item.path));
  }
})();
