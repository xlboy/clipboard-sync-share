import { Badge, Card, Group, Text } from '@mantine/core';
import type { SocketServer } from '@shared/types/socket';
import { tw } from 'twind';

import { useSocketStore } from '../store';

interface ConnectInfoCardProps {}

function ConnectInfoCard(props: ConnectInfoCardProps): JSX.Element {
  const { currentConnectedInfo } = useSocketStore();

  return (
    <Card shadow="md" className={tw`mt-[10px] overflow-hidden`}>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text weight={500}>Connection situation</Text>
        </Group>
      </Card.Section>
      <div className={tw`w-full flex p-[10px] justify-around`}>
        {renderConnectInfo('server', currentConnectedInfo.server)}
        {currentConnectedInfo.clients.map(client => renderConnectInfo('client', client))}
      </div>
    </Card>
  );

  type InfoMap = {
    client: SocketServer.ConnectClientInfo;
    server: SocketServer.Info;
  };

  function renderConnectInfo<T extends keyof InfoMap, I extends InfoMap[T]>(
    type: T,
    info: I
  ) {
    return (
      <div
        className={tw`hover:(shadow-lg) cursor-pointer border(&) rounded-[5px] p-[5px]`}
      >
        <Badge color={type === 'client' ? 'indigo' : 'grape'}>
          {type === 'client' ? 'Client Host' : 'Server Host'}
        </Badge>
        <br />
        <Badge color="cyan">IP: {info.ip}</Badge>
        <br />

        {info.hostname && <Badge color="pink">HOSTNAME: {info.hostname}</Badge>}
      </div>
    );
  }
}

export default ConnectInfoCard;
