import 'fork-awesome/css/fork-awesome.min.css';
import 'main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {APIContext} from '@xorkevin/substation';
import {AuthContext} from '@xorkevin/turbine';

import Admin from 'admin';
import {APIClient} from 'service/apiclient';
import store from 'adminstore';
import Section from 'component/section';

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

ReactDOM.render(
  <div id="mount">
    <Provider store={store}>
      <BrowserRouter>
        <APIContext.Provider value={APIClient}>
          <AuthContext.Provider value={AuthContextValue}>
            <Admin />
          </AuthContext.Provider>
        </APIContext.Provider>
      </BrowserRouter>
    </Provider>
  </div>,
  document.getElementById('mount'),
);
