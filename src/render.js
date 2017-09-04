import 'isomorphic-fetch';
import {h} from 'preact';
import preactRenderToString from 'preact-render-to-string';
import {Provider} from 'preact-redux';
import {StaticRouter} from 'react-router-dom';

import App from 'app';
import {Terminal} from 'battery';
import makeStore from 'store';

const renderToString = (url, props)=>{
  const context = {};

  const html = preactRenderToString(<div id="mount">
    <Terminal>
      <Provider store={makeStore()}>
        <StaticRouter location={url} context={context}>
          <App {...props}/>
        </StaticRouter>
      </Provider>
    </Terminal>
  </div>);

  if(context.url){
    return {
      redirect: true,
      url: context.url,
    };
  }
  return {
    redirect: false,
    html: html,
  };
};

export {
  renderToString
}
