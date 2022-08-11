import { Button, Card, Input, Row, Text } from '@nextui-org/react';
import { useSetState } from 'ahooks';
import { memo } from 'react';
import type { F } from 'ts-toolbelt';
import { tw } from 'twind';

interface IOServerCardProps {
  serverStarted?: boolean;
  refreshServerStatus: F.Function;
}

function IOServerCard(props: IOServerCardProps): JSX.Element {
  const { refreshServerStatus, serverStarted } = props;
  const [{ serverPort }, setStates] = useSetState({
    serverPort: 8888
  });

  async function onCloseSocketServer() {
    await mainProcessAPI.ioServer.close();

    refreshServerStatus();
  }

  async function onStartSocketServer() {
    const port = await mainProcessAPI.ioServer.start(serverPort);

    refreshServerStatus();
    setStates({ serverPort: port });
  }

  return (
    <Card className={tw`w-full my-[10px]`}>
      <Card.Header>
        <div className={tw`w-full flex justify-between`}>
          <Text b>Server Controller</Text>
          <Text b color={serverStarted ? '#54da00' : '#da5e00'}>
            {serverStarted ? `${serverPort} port started` : 'closed'}
          </Text>
        </div>
      </Card.Header>
      <Card.Divider />

      <Card.Body css={{ py: 10 }}>
        <Row css={{ mt: 23 }}>
          <Input
            bordered
            type="number"
            min={1000}
            labelPlaceholder="Server Port"
            css={{ w: '100%', mb: 10 }}
            color="secondary"
            value={serverPort}
            onChange={e => {
              setStates({ serverPort: +e.target.value });
            }}
          />
        </Row>
        <Row>
          {serverStarted ? (
            <Button onPress={onCloseSocketServer} css={{ w: '100%' }} color="error">
              Close
            </Button>
          ) : (
            <Button onPress={onStartSocketServer} css={{ w: '100%' }} color="success">
              Open
            </Button>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}

export default memo(IOServerCard);
