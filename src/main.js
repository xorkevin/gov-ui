import {h, render} from 'preact';
import {Provider} from 'preact-redux';
import {BrowserRouter} from 'react-router-dom';
import 'swload.js';

import App from 'app';
import {Terminal} from 'battery';
import makeStore from 'store';

render(<div id="mount">
  <Terminal>
    <Provider store={makeStore()}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
  </Terminal>
</div>, document.body, document.getElementById('mount'));
