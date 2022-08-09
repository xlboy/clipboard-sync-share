import { useRoutes } from 'react-router-dom';

import IndexPage from './pages/index';
import Page2 from './pages/page-2';

function Routes(): JSX.Element {
  const element = useRoutes([
    {
      index: true,
      element: <IndexPage />
    },
    {
      path: '/page-2',
      element: <Page2 />
    }
  ]);

  return <>{element}</>;
}

export default Routes;
