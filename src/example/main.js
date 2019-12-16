import 'fork-awesome/css/fork-awesome.min.css';
import 'inter-ui/inter.css';
import 'typeface-merriweather/index.css';
import 'example/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {APIContext} from '@xorkevin/substation';
import {AuthContext} from '@xorkevin/turbine';
import {Section} from '@xorkevin/nuke';

import App from 'example/app';
import {APIClient} from 'example/api';
import store from 'example/store';

const UnAuthFallback = (
  <Section container padded narrow>
    Unauthorized
  </Section>
);

const AuthContextValue = {
  selectReducerAuth: (store) => store.Auth,
  selectAPILogin: (api) => api.u.auth.login,
  selectAPIExchange: (api) => api.u.auth.exchange,
  selectAPIRefresh: (api) => api.u.auth.refresh,
  fallback: UnAuthFallback,
  paramName: 'redir',
  homePath: '/',
  loginPath: '/x/login',
  authLoading: Promise.resolve(),
};

ReactDOM.render(
  <div id="mount">
    <Provider store={store}>
      <BrowserRouter>
        <APIContext.Provider value={APIClient}>
          <AuthContext.Provider value={AuthContextValue}>
            <App />
          </AuthContext.Provider>
        </APIContext.Provider>
      </BrowserRouter>
    </Provider>
  </div>,
  document.getElementById('mount'),
);
