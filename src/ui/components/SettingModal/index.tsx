import type { FormElement } from '@nextui-org/react';
import { Grid, Input, Modal, Text } from '@nextui-org/react';
import { useSetState } from 'ahooks';
import { useImperativeHandle } from 'react';
import type { F } from 'ts-toolbelt';

import type { SettingStoreState } from '../../stores/setting';
import { useSettingStore } from '../../stores/setting';

interface SettingModalProps {
  open: React.MutableRefObject<F.Function | undefined>;
}

function SettingModal(props: SettingModalProps): JSX.Element {
  const { hostname, connectAddress, setConnectAddress, setHostname } = useSettingStore();
  const [{ visible }, setStates] = useSetState({
    visible: false
  });

  useImperativeHandle(props.open, () =>
    setStates.bind(null, {
      visible: true
    })
  );

  function onClose() {
    setStates({
      visible: false
    });
  }

  function onSave() {}

  function inputChangeHandler(changeField: keyof SettingStoreState) {
    return (e: React.ChangeEvent<FormElement>) => {
      const value = e.target.value;

      console.log('value', value);

      switch (changeField) {
        case 'connectAddress':
          setConnectAddress(value);
          break;
        case 'hostname':
          setHostname(value);
          break;
      }
    };
  }

  return (
    <Modal closeButton aria-labelledby="modal-title" open={visible} onClose={onClose}>
      <Modal.Header>
        <Text size={18}>Setting</Text>
      </Modal.Header>
      <Modal.Body css={{ pt: 30 }}>
        <Grid css={{ mb: 35 }}>
          <Input
            bordered
            labelPlaceholder="hostname"
            css={{ w: '100%' }}
            color="secondary"
            value={hostname}
            onChange={inputChangeHandler('hostname')}
          />
        </Grid>
        <Grid>
          <Input
            bordered
            labelPlaceholder="connectAddress"
            css={{ w: '100%' }}
            color="secondary"
            value={connectAddress}
            onChange={inputChangeHandler('connectAddress')}
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button auto onClick={onSave}>
          Save
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
}

export default SettingModal;
