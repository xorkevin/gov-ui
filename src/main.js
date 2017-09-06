import 'font-awesome/css/font-awesome.min.css';
import 'main.scss';

import {h, render} from 'preact';
import {Provider} from 'preact-redux';
import {BrowserRouter} from 'react-router-dom';
import 'swload.js';

import App from 'app';
import {Terminal} from 'battery';
import makeStore from 'store';

render(<div id="mount">
  <Provider store={makeStore()}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
</div>, document.body, document.getElementById('mount'));
