import type { MantineColor, TextInputProps } from '@mantine/core';
import { Button, Loader, TextInput } from '@mantine/core';
import { useSetState } from 'ahooks';
import { useFormik } from 'formik';
import { memo } from 'react';
import { tw } from 'twind';

import { MaterialSymbolsCheckCircleRounded } from '../icons';
import { useSocketStore } from '../store';

interface IOClientCardProps {}

function IOClientCard(props: IOClientCardProps): JSX.Element {
  const { client: clientState } = useSocketStore();
  const localDeviceInfo = mainProcessAPI.getLocalDeviceInfo();

  const clientConnected = clientState.status === 'connected';
  const clientConnecting = clientState.status === 'connecting';

  // TODO: 尝试换成 react-hook-form + zod
  const formik = useFormik({
    initialValues: {
      hostname: localDeviceInfo.hostname,
      connectAddress: 'http://localhost:8888'
    },
    onSubmit(values) {
      mainProcessAPI.ioClient.connect(values.connectAddress, values.hostname);

      // showNotification({
      //   color: 'teal',
      //   title: 'Startup success',
      //   icon: <MaterialSymbolsCheckCircleRounded fontSize={30} />,
      //   message: (
      //     <span>
      //       The service of port{' '}
      //       <span className={tw`font-extrabold`}>{formik.values.port}</span> has been
      //       started successfully.
      //     </span>
      //   ),
      //   autoClose: 2000
      // });
    }
  });

  function onCloseClient() {
    mainProcessAPI.ioClient.close();
  }

  function onCancelConnectClient() {
    mainProcessAPI.ioClient.close();
  }

  const formBaseProps: TextInputProps = {
    onChange: formik.handleChange,
    onBlur: formik.handleBlur
  };

  return (
    <div className={tw`py-[10px]`}>
      <form onSubmit={formik.handleSubmit}>
        <TextInput
          label="Hostname"
          variant="filled"
          radius="md"
          name="hostname"
          {...formBaseProps}
          value={formik.values.hostname}
          disabled={clientConnected || clientConnecting}
        />
        <TextInput
          label="Connect Address"
          variant="filled"
          radius="md"
          name="connectAddress"
          required
          {...formBaseProps}
          value={formik.values.connectAddress}
          disabled={clientConnected || clientConnecting}
        />

        <div className={tw`mt-[10px]`}>
          {clientConnected ? (
            <Button onClick={onCloseClient} color="red" fullWidth variant="light">
              Disconnect
            </Button>
          ) : (
            (() => {
              const color: MantineColor = clientConnecting ? 'yellow' : 'teal';

              return (
                <Button
                  type={clientConnecting ? 'button' : 'submit'}
                  onClick={clientConnecting ? onCancelConnectClient : undefined}
                  color={color}
                  fullWidth
                  variant="light"
                  rightIcon={clientConnecting ? <Loader size="sm" color={color} /> : null}
                >
                  {clientConnecting ? 'Cancel' : 'Connect'}
                </Button>
              );
            })()
          )}
        </div>
      </form>
    </div>
  );
}

export default memo(IOClientCard);
