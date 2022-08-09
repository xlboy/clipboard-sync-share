import { Button } from '@nextui-org/react';
import { useRequest, useSetState } from 'ahooks';
import React from 'react';
import { tw } from 'twind';

interface IndexPageProps {}

function IndexPage(props: IndexPageProps): JSX.Element {
  const { data: isStartedServer, refresh: refreshServerOpenStatus } = useRequest(
    mainProcessAPI.socketServer.getStatus
  );
  const [{ serverPort }, setStates] = useSetState({
    serverPort: 0
  });

  async function onCloseSocketServer() {
    await mainProcessAPI.socketServer.close();

    refreshServerOpenStatus();
  }

  async function onStartSocketServer() {
    const port = await mainProcessAPI.socketServer.start();

    refreshServerOpenStatus();

    setStates({ serverPort: port });
  }

  return (
    <div className={tw`w-screen h-screen p-[5px]`}>
      <div>
        当前状态： {JSON.stringify(isStartedServer)}
        {isStartedServer ? (
          <Button onPress={onCloseSocketServer}>关闭</Button>
        ) : (
          <Button onPress={onStartSocketServer}>开启</Button>
        )}
        {isStartedServer && <div>已打开的端口：{serverPort}</div>}
      </div>
    </div>
  );
}

export default React.memo(IndexPage);
