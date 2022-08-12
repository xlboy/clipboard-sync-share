// import SettingModal from '@ui/components/SettingModal';
import { Button } from '@mantine/core';
import { useRef } from 'react';
import type { F } from 'ts-toolbelt';
import { tw } from 'twind';

interface HomeHeaderProps {}

function HomeHeader(props: HomeHeaderProps): JSX.Element {
  const openSettingModal = useRef<F.Function>();

  return (
    <div className={tw`h-[50px] flex justify-end items-center`}>
      {/* <SettingModal open={openSettingModal} /> */}
      <Button
        color="secondary"
        // icon={
        //   <MaterialSymbolsSettingsSuggest
        //     className={tw`text([25px] [block]) mt-[-2px]`}
        //   />
        // }
        onClick={() => {
          openSettingModal.current?.();
        }}
      />
    </div>
  );
}

export default HomeHeader;
