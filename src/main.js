import 'font-awesome/css/font-awesome.min.css';
import 'main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';

import App from 'app';
import makeStore from 'store';

ReactDOM.render(
  <div id="mount">
    <Provider store={makeStore()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </div>,
  document.body,
);
