import { Button } from '@nextui-org/react';
import SettingModal from '@ui/components/SettingModal';
import { useRef } from 'react';
import type { F } from 'ts-toolbelt';
import { tw } from 'twind';

import { MaterialSymbolsSettingsSuggest } from '../icons';

interface HomeHeaderProps {}

function HomeHeader(props: HomeHeaderProps): JSX.Element {
  const openSettingModal = useRef<F.Function>();

  return (
    <div className={tw`h-[50px] flex justify-end items-center`}>
      <SettingModal open={openSettingModal} />
      <Button
        auto
        shadow
        color="secondary"
        ghost
        icon={
          <MaterialSymbolsSettingsSuggest
            className={tw`text([25px] [block]) mt-[-2px]`}
          />
        }
        onClick={() => {
          openSettingModal.current?.();
        }}
      />
    </div>
  );
}

export default HomeHeader;
