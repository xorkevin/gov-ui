const express = require('express');
const {h} = require('preact');
const render = require('preact-render-to-string');
const App = require('../src/app');

const app = express();
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static('bin'));
app.use(express.static('public'));
app.get('/*', (req, res) => {
  res.render('bin/index', {html: render(h(App))});
});

app.listen(3030);
