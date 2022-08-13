import type { TextInputProps } from '@mantine/core';
import { Button, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useFormik } from 'formik';
import { memo } from 'react';
import { tw } from 'twind';

import { MaterialSymbolsCheckCircleRounded } from '../icons';
import { useSocketStore } from '../store';

interface IOServerCardProps {}

function IOServerCard(props: IOServerCardProps): JSX.Element {
  const { server: serverState } = useSocketStore();
  const localDeviceInfo = mainProcessAPI.getLocalDeviceInfo();

  // TODO: 尝试换成 react-hook-form + zod
  const formik = useFormik({
    initialValues: {
      hostname: localDeviceInfo.hostname,
      port: '8888'
    },
    async onSubmit(values) {
      await mainProcessAPI.ioServer.start({
        port: +values.port,
        hostname: values.hostname
      });

      showNotification({
        color: 'teal',
        title: 'Startup success',
        icon: <MaterialSymbolsCheckCircleRounded fontSize={30} />,
        message: (
          <span>
            The service of port{' '}
            <span className={tw`font-extrabold`}>{formik.values.port}</span> has been
            started successfully.
          </span>
        ),
        autoClose: 2000
      });
    }
  });

  const serverStarted = serverState.status === 'started';

  async function onCloseSocketServer() {
    await mainProcessAPI.ioServer.close();
    showNotification({
      color: 'teal',
      icon: <MaterialSymbolsCheckCircleRounded fontSize={30} />,
      message: 'Close the success',
      autoClose: 2000
    });
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
          disabled={serverStarted}
        />
        <TextInput
          label="Server Port"
          variant="filled"
          radius="md"
          required
          name="port"
          {...formBaseProps}
          value={formik.values.port}
          disabled={serverStarted}
        />
        <div className={tw`mt-[10px]`}>
          {serverStarted ? (
            <Button onClick={onCloseSocketServer} fullWidth variant="light" color="red">
              Close
            </Button>
          ) : (
            <Button type="submit" fullWidth variant="light" color="teal">
              Start
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default memo(IOServerCard);
