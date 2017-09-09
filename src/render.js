import {h} from 'preact';
import preactRenderToString from 'preact-render-to-string';
import {Provider} from 'preact-redux';
import {StaticRouter} from 'react-router-dom';

import App from 'app';
import Admin from 'admin';
import {Terminal, Battery} from 'battery';
import makeStore from 'store';
import makeAdminStore from 'adminstore';

const renderApp = (props, store, battery, url, context)=>{
  return preactRenderToString(<div id="mount">
    <Terminal battery={battery}>
      <Provider store={store}>
        <StaticRouter location={url} context={context}>
          <App {...props}/>
        </StaticRouter>
      </Provider>
    </Terminal>
  </div>);
};

const renderToString = async (url, props)=>{
  const store = makeStore();
  const battery = new Battery(store);
  const context = {};

  let html = renderApp(props, store, battery, url, context);

  if(context.url){
    return {
      redirect: true,
      url: context.url,
    };
  }

  if(battery.size() > 0){
    await battery.resolve();
    html = renderApp(props, store, null, url, context);
  }

  return {
    redirect: false,
    html: html,
    state: store.getState(),
  };
};

const renderAdmin = (props, store, url, context)=>{
  return preactRenderToString(<div id="mount">
    <Provider store={store}>
      <StaticRouter location={url} context={context}>
        <Admin {...props}/>
      </StaticRouter>
    </Provider>
  </div>);
};

const renderAdminToString = (url, props)=>{
  const store = makeAdminStore();
  const context = {};

  let html = renderAdmin(props, store, url, context);

  if(context.url){
    return {
      redirect: true,
      url: context.url,
    };
  }

  return {
    redirect: false,
    html: html,
    state: store.getState(),
  };
};

export {
  renderToString, renderAdminToString,
}
