import { Button, Card, Input, Text } from '@nextui-org/react';
import { useRequest, useSetState } from 'ahooks';
import { tw } from 'twind';

interface IOClientCardProps {}

function IOClientCard(props: IOClientCardProps): JSX.Element {
  const { data: isConnectedStatus, refresh: refreshConnectedStatus } = useRequest(
    mainProcessAPI.ioClient.getStatus
  );

  const [{ connectAddress }, setStates] = useSetState({
    connectAddress: 'http://localhost:8888'
  });

  async function onCloseClientSocket() {
    await mainProcessAPI.ioClient.close();

    refreshConnectedStatus();
  }

  async function onConnectClientSocket() {
    console.log('时间1', +new Date());

    if (connectAddress) {
      await mainProcessAPI.ioClient.connect(connectAddress);
      console.log('时间2', +new Date());

      refreshConnectedStatus();
    }

    alert('please enter connect address');
  }

  return (
    <Card className={tw`w-full my-[10px]`}>
      <Card.Header>
        <div className={tw`w-full flex justify-between`}>
          <Text b>Client Ctronller</Text>
          {/* <Text b color={isStartedServer ? '#54da00' : '#da5e00'}>
            <span className={tw`h-[5px] w-[5px]`}>
              {isStartedServer ? `${serverPort} port started` : 'closed'}
            </span>
          </Text> */}
        </div>
      </Card.Header>
      <Card.Divider />

      <Card.Body className={tw`py-[10px]`}>
        <div className={tw`mt-[23px]`}>
          <Input
            bordered
            labelPlaceholder="connectAddress"
            css={{ w: '100%' }}
            color="secondary"
            value={connectAddress}
            onChange={e => {
              setStates({ connectAddress: e.target.value });
            }}
          />
        </div>

        <div className={tw`mt-[10px]`}>
          {isConnectedStatus ? (
            <Button onPress={onCloseClientSocket}>关闭</Button>
          ) : (
            <Button onPress={onConnectClientSocket}>连接</Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default IOClientCard;
