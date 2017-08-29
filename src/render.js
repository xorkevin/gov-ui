const {h} = require('preact');
const preactRenderToString = require('preact-render-to-string');
const App = require('app');

const renderToString = (props)=>{
  return preactRenderToString(h(App, props));
};

module.exports = {
  renderToString: renderToString,
};
