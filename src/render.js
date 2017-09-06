import 'isomorphic-fetch';
import {h} from 'preact';
import preactRenderToString from 'preact-render-to-string';
import {Provider} from 'preact-redux';
import {StaticRouter} from 'react-router-dom';

import App from 'app';
import {Terminal, Battery} from 'battery';
import makeStore from 'store';

const renderToString = async (url, props)=>{
  const store = makeStore();
  const battery = new Battery(store);
  const context = {};

  console.log('context before', context);

  const vdom = <div id="mount">
    <Terminal battery={battery}>
      <Provider store={store}>
        <StaticRouter location={url} context={context}>
          <App {...props}/>
        </StaticRouter>
      </Provider>
    </Terminal>
  </div>;

  const html = preactRenderToString(vdom);

  console.log('context after', context);

  if(context.url){
    return {
      redirect: true,
      url: context.url,
    };
  }

  await battery.resolve();

  console.log(store.getState());

  return {
    redirect: false,
    html: html,
  };
};

export {
  renderToString
}
