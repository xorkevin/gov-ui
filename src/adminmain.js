import 'fork-awesome/css/fork-awesome.min.css';
import 'main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {APIContext} from '@xorkevin/substation';

import Admin from 'admin';
import {APIClient} from 'service/apiclient';
import store from 'adminstore';

ReactDOM.render(
  <div id="mount">
    <Provider store={store}>
      <BrowserRouter>
        <APIContext.Provider value={APIClient}>
          <Admin />
        </APIContext.Provider>
      </BrowserRouter>
    </Provider>
  </div>,
  document.getElementById('mount'),
);
