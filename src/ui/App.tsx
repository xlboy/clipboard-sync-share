import { Button, Loading } from '@nextui-org/react';
import * as React from 'react';
import { Inspector } from 'react-dev-inspector';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import { tw } from 'twind';

import Routes from './Routes';
import { queryClient } from './utils/libs/react-query';

function ErrorFallback(): JSX.Element {
  return (
    <div
      className={tw`text-red-500 w-screen h-screen flex(& col) justify-center items-center`}
      role="alert"
    >
      <h2 className={tw`text-lg font-semibold`}>Ooops, something went wrong :( </h2>
      <Button className={tw`mt-4`} onClick={() => location.assign(location.origin)}>
        Refresh
      </Button>
    </div>
  );
}

function InspectorWrapper({ children }: { children: JSX.Element }): JSX.Element {
  return import.meta.env.DEV ? <Inspector>{children}</Inspector> : children;
}

function App(): JSX.Element {
  return (
    <React.Suspense
      fallback={
        <div className={tw`flex items-center justify-center w-screen h-screen`}>
          <Loading type="points" />
        </div>
      }
    >
      <InspectorWrapper>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            <Router>
              <Routes />
            </Router>
          </QueryClientProvider>
        </ErrorBoundary>
      </InspectorWrapper>
    </React.Suspense>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
