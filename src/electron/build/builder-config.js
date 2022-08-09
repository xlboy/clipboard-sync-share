/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  appId: 'ClipboardSyncAPP',
  productName: 'ClipboardSyncAPP',
  copyright: 'Copyright © 2022 ${author}',
  asar: true,
  directories: {
    output: 'release/${version}',
    buildResources: './resources'
  },
  files: ['dist', 'scripts'],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    artifactName: '${productName}-Windows-${version}-Setup.${ext}'
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false
  },
  mac: {
    target: ['dmg'],
    artifactName: '${productName}-Mac-${version}-Installer.${ext}'
  },
  linux: {
    target: ['AppImage'],
    artifactName: '${productName}-Linux-${version}.${ext}'
  }
};

module.exports = options;
