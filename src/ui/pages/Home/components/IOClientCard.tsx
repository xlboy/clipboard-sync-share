import { Button, Card, Input, Loading, Row, Text } from '@nextui-org/react';
import type { ClientSocket } from '@shared/types/socket';
import { useSetState } from 'ahooks';
import { memo } from 'react';
import type { F } from 'ts-toolbelt';

interface IOClientCardProps {
  refreshConnectedStatus: F.Function;
  clientSocketStatus?: ClientSocket.Status;
}

function IOClientCard(props: IOClientCardProps): JSX.Element {
  const { clientSocketStatus, refreshConnectedStatus } = props;

  const [{ connectAddress }, setStates] = useSetState({
    connectAddress: 'http://localhost:8888'
  });

  async function onCloseClientSocket() {
    await mainProcessAPI.ioClient.close();

    refreshConnectedStatus();
  }

  async function onConnectClientSocket() {
    if (connectAddress) {
      mainProcessAPI.ioClient.connect(connectAddress);

      refreshConnectedStatus();
    } else {
      alert('Please enter connect address');
    }
  }

  async function onCancelClientSocket() {
    await mainProcessAPI.ioClient.close();
    refreshConnectedStatus();
  }

  return (
    <Card css={{ w: '100%', my: 10 }}>
      <Card.Header>
        <Row justify="space-between" css={{ w: '100%' }}>
          <Text b>Client Controller</Text>
        </Row>
      </Card.Header>
      <Card.Divider />

      <Card.Body css={{ py: 10 }}>
        <Row css={{ mt: 23 }}>
          <Input
            bordered
            labelPlaceholder="Connect Address"
            css={{ w: '100%' }}
            color="secondary"
            value={connectAddress}
            onChange={e => {
              setStates({ connectAddress: e.target.value });
            }}
          />
        </Row>

        <Row css={{ mt: 10 }}>
          {clientSocketStatus === 'connected' ? (
            <Button
              onPress={onCloseClientSocket}
              css={{ w: '100%' }}
              color="error"
              shadow
            >
              Disconnect
            </Button>
          ) : (
            (isConnectingStatus => (
              <Button
                onPress={
                  isConnectingStatus ? onCancelClientSocket : onConnectClientSocket
                }
                css={{ w: '100%' }}
                color={isConnectingStatus ? 'warning' : 'success'}
                iconRight={
                  isConnectingStatus ? <Loading color="currentColor" size="sm" /> : null
                }
              >
                {isConnectingStatus ? 'Cancel' : 'Connect'}
              </Button>
            ))(clientSocketStatus === 'connecting')
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}

export default memo(IOClientCard);
