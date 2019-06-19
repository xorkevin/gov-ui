import 'font-awesome/css/font-awesome.min.css';
import 'main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import Admin from 'admin';
import {APIContext, APIClient} from 'apiclient';
import makeStore from 'adminstore';

ReactDOM.render(
  <div id="mount">
    <Provider store={makeStore()}>
      <BrowserRouter>
        <APIContext.Provider value={APIClient}>
          <Admin />
        </APIContext.Provider>
      </BrowserRouter>
    </Provider>
  </div>,
  document.getElementById('mount'),
);
