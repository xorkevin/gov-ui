import 'font-awesome/css/font-awesome.min.css';
import 'main.scss';

import {h, render} from 'preact';
import {Provider} from 'preact-redux';
import {BrowserRouter} from 'react-router-dom';

import Admin from 'admin';
import makeStore from 'adminstore';

render(
  <div id="mount">
    <Provider store={makeStore()}>
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    </Provider>
  </div>,
  document.body,
  document.getElementById('mount'),
);
