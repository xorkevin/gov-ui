import 'font-awesome/css/font-awesome.min.css';
import 'main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import Admin from 'admin';
import makeStore from 'adminstore';

ReactDOM.render(
  <div id="mount">
    <Provider store={makeStore()}>
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    </Provider>
  </div>,
  document.body,
);
