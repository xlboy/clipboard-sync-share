import { useRequest } from 'ahooks';
import React from 'react';

import Header from './components/Header';
import IOClientCard from './components/IOClientCard';
import IOServerCard from './components/IOServerCard';
import { useStyles } from './styles';

function HomePage(): JSX.Element {
  const styles = useStyles();

  const ServerCardModule = (() => {
    const { data: serverStarted, refresh: refreshServerStatus } = useRequest(
      mainProcessAPI.ioServer.getStatus
    );

    return {
      data: {
        refreshServerStatus,
        serverStarted
      },
      Component: IOServerCard
    };
  })();

  const ClientCardModule = (() => {
    const { data: clientSocketStatus, refresh: refreshConnectedStatus } = useRequest(
      mainProcessAPI.ioClient.getStatus,
      { pollingInterval: 500, pollingWhenHidden: false }
    );

    return {
      Component: IOClientCard,
      data: {
        clientSocketStatus,
        refreshConnectedStatus
      }
    };
  })();

  return (
    <div className={styles['root-wrapper']}>
      <Header />
      {/* {ClientCardModule.clientSocketStatus === 'disconnect' && (
        <ServerCardModule.Component {...ServerCardModule.data} />
      )}
      {!ServerCardModule.serverStarted && <ClientCardModule.Component {...ClientCardModule.data} />} */}

      <ServerCardModule.Component {...ServerCardModule.data} />
      <ClientCardModule.Component {...ClientCardModule.data} />
    </div>
  );
}

export default React.memo(HomePage);
