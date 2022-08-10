import React from 'react';

import HomeHeader from './components/Header';
import IOClientCard from './components/IOClientCard';
import IOServerCard from './components/IOServerCard';
import { useStyles } from './styles';

function HomePage(): JSX.Element {
  const styles = useStyles();

  return (
    <div className={styles['root-wrapper']}>
      <HomeHeader />
      <IOServerCard />
      <IOClientCard />
    </div>
  );
}

export default React.memo(HomePage);
