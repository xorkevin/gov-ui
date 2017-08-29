import {h} from 'preact';
import preactRenderToString from 'preact-render-to-string';
import App from 'app';

const renderToString = (props)=>{
  return preactRenderToString(h(App, props));
};

export {
  renderToString
}
