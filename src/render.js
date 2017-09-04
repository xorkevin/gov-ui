import {h} from 'preact';
import preactRenderToString from 'preact-render-to-string';
import {Provider} from 'preact-redux';
import {StaticRouter} from 'react-router-dom';

import App from 'app';
import {Terminal} from 'battery';
import makeStore from 'store';

const renderToString = (props)=>{
  const context = {};
  return preactRenderToString(<div id="mount">
    <Terminal>
      <Provider store={makeStore()}>
        <StaticRouter context={context}>
          <App {...props}/>
        </StaticRouter>
      </Provider>
    </Terminal>
  </div>);
};

export {
  renderToString
}
