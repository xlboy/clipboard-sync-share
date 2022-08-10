import { useRoutes } from 'react-router-dom';

import HomePage from './pages/Home';
import Page2 from './pages/page-2';

function Routes(): JSX.Element {
  const element = useRoutes([
    {
      index: true,
      element: <HomePage />
    },
    {
      path: '/page-2',
      element: <Page2 />
    }
  ]);

  return <>{element}</>;
}

export default Routes;
