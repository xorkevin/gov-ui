import 'font-awesome/css/font-awesome.min.css';
import 'main.scss';

import {h, render} from 'preact';
import {Provider} from 'preact-redux';
import {BrowserRouter} from 'react-router-dom';
import swload from 'swload';

import App from 'app';
import makeStore from 'store';

swload(true);

render(<div id="mount">
  <Provider store={makeStore()}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
</div>, document.body, document.getElementById('mount'));
