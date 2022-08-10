import { Button, Card, Text } from '@nextui-org/react';
import { useRequest, useSetState } from 'ahooks';
import { tw } from 'twind';

interface IOServerCardProps {}

function IOServerCard(props: IOServerCardProps): JSX.Element {
  const { data: isStartedServer, refresh: refreshServerOpenStatus } = useRequest(
    mainProcessAPI.ioServer.getStatus
  );

  const [{ serverPort }, setStates] = useSetState({
    serverPort: 0
  });

  async function onCloseSocketServer() {
    await mainProcessAPI.ioServer.close();

    refreshServerOpenStatus();
  }

  async function onStartSocketServer() {
    const port = await mainProcessAPI.ioServer.start(8888);

    refreshServerOpenStatus();

    setStates({ serverPort: port });
  }

  return (
    <Card className={tw`w-full my-[10px]`}>
      <Card.Header>
        <div className={tw`w-full flex justify-between`}>
          <Text b>Server Ctronller</Text>
          <Text b color={isStartedServer ? '#54da00' : '#da5e00'}>
            <span className={tw`h-[5px] w-[5px]`}>
              {isStartedServer ? `${serverPort} port started` : 'closed'}
            </span>
          </Text>
        </div>
      </Card.Header>
      <Card.Divider />

      <Card.Body className={tw`py-[10px]`}>
        <div>
          {isStartedServer ? (
            <Button onPress={onCloseSocketServer}>关闭</Button>
          ) : (
            <Button onPress={onStartSocketServer}>开启</Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default IOServerCard;
