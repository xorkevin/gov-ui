const express = require('express');
const renderToString = require('../src/app').renderToString;

const app = express();
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use('/static', express.static('bin/static'));
app.use('/static', express.static('public/static'));
app.get('/*', (req, res) => {
  console.log('renderToString length', renderToString().length);
  res.render('bin/index', {html: renderToString()});
});

app.listen(3030);
