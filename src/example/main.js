import 'fork-awesome/css/fork-awesome.min.css';
import 'example/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {APIContext} from '@xorkevin/substation';
import {AuthContext} from '@xorkevin/turbine';
import {Section} from '@xorkevin/nuke';

import {GovContext} from 'govcontext';
import App from 'example/app';
import {APIClient} from 'example/api';
import store from 'example/store';

const UnAuthFallback = (
  <Section container padded narrow>
    Unauthorized
  </Section>
);

const AuthContextValue = Object.freeze({
  selectReducerAuth: (store) => store.Auth,
  selectAPILogin: (api) => api.u.auth.login,
  selectAPIExchange: (api) => api.u.auth.exchange,
  selectAPIRefresh: (api) => api.u.auth.refresh,
  fallback: UnAuthFallback,
  paramName: 'redir',
  homePath: '/',
  loginPath: '/x/login',
});

const GovContextValue = Object.freeze({
  homePath: '/',
  // eslint-disable-next-line no-undef
  courierPath: COURIERBASE_URL,
});

ReactDOM.render(
  <div id="mount">
    <Provider store={store}>
      <BrowserRouter>
        <APIContext.Provider value={APIClient}>
          <AuthContext.Provider value={AuthContextValue}>
            <GovContext.Provider value={GovContextValue}>
              <App />
            </GovContext.Provider>
          </AuthContext.Provider>
        </APIContext.Provider>
      </BrowserRouter>
    </Provider>
  </div>,
  document.getElementById('mount'),
);
