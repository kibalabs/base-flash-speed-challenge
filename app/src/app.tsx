import React from 'react';

import { LocalStorageClient, Requester } from '@kibalabs/core';
import { IRoute, MockStorage, Router, SubRouter } from '@kibalabs/core-react';
import { ComponentDefinition, IHeadRootProviderProps, KibaApp } from '@kibalabs/ui-react';
import { buildToastThemes, Toast, ToastContainer, ToastThemedStyle, useToastManager } from '@kibalabs/ui-react-toast';
import { Web3AccountControlProvider } from '@kibalabs/web3-react';

import { ContainingView } from './components/ContainingView';
import { GlobalsProvider, IGlobals } from './GlobalsContext';
import { PageDataProvider } from './PageDataContext';
import { HomePage } from './pages/HomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { buildHookeTheme } from './theme';
import './fonts.css';

declare global {
  export interface Window {
    KRT_API_URL?: string;
  }
}

const requester = new Requester();
// const ysRequester = new Requester();
// const baseUrl = typeof window !== 'undefined' && window.KRT_API_URL ? window.KRT_API_URL : 'https://demo-api.yieldseeker.xyz';
const localStorageClient = new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : new MockStorage());
const sessionStorageClient = new LocalStorageClient(typeof window !== 'undefined' ? window.sessionStorage : new MockStorage());
const theme = buildHookeTheme();

const globals: IGlobals = {
  requester,
  localStorageClient,
  sessionStorageClient,
};

const routes: IRoute<IGlobals>[] = [
  { path: '/', page: HomePage },
  { path: '/leaderboard', page: LeaderboardPage },
];

interface IAppProps extends IHeadRootProviderProps {
  staticPath?: string;
  pageData?: unknown | undefined | null;
}

const extraGlobalCss = `
table td, table th {
  border: 1px solid var(--color-background-light05);
  padding: 0.5em 1em;
}

table tr:nth-child(even){
  background-color: var(--color-background-light05);
}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  // background-color: var(--color-brand-primary);
  // color: var(--color-text-on-brand);
  font-weight: bold;
  border-bottom: 1px solid var(--color-brand-primary);
}
`;

// @ts-expect-error
const extraComponentDefinitions: ComponentDefinition[] = [{
  component: Toast,
  themeMap: buildToastThemes(theme.colors, theme.dimensions, theme.boxes, theme.texts, theme.icons),
  themeCssFunction: ToastThemedStyle,
}];

export function App(props: IAppProps): React.ReactElement {
  const toastManager = useToastManager();

  const onWeb3AccountError = React.useCallback((error: Error): void => {
    toastManager.showTextToast(error.message, 'error');
  }, [toastManager]);

  return (
    <KibaApp theme={theme} isFullPageApp={true} setHead={props.setHead} extraComponentDefinitions={extraComponentDefinitions} extraGlobalCss={extraGlobalCss}>
      <PageDataProvider initialData={props.pageData}>
        <GlobalsProvider globals={globals}>
          <Router staticPath={props.staticPath}>
            <Web3AccountControlProvider localStorageClient={localStorageClient} onError={onWeb3AccountError}>
              <ContainingView>
                <SubRouter routes={routes} />
              </ContainingView>
              <ToastContainer />
            </Web3AccountControlProvider>
          </Router>
        </GlobalsProvider>
      </PageDataProvider>
    </KibaApp>
  );
}
