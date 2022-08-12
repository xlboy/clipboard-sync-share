import { useRoutes } from 'react-router-dom';

import HomePage from './pages/Home';

function Routes(): JSX.Element {
  const element = useRoutes([
    {
      index: true,
      element: <HomePage />
    }
  ]);

  return <>{element}</>;
}

export default Routes;
