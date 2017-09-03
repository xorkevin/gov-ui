import {h, render} from 'preact';
import {Provider} from 'preact-redux';
import {BrowserRouter} from 'react-router-dom';

import App from 'app';
import makeStore from 'store';

render(<div id="mount">
  <Provider store={makeStore()}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
</div>, document.body, document.getElementById('mount'));
