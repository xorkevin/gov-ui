const express = require('express');
const renderToString = require('./bin_server/render');

console.log(require('./bin_server/render'));

const app = express();
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use('/static', express.static('bin/static'));
app.use('/static', express.static('public/static'));
app.get('/*', (req, res) => {
  res.render('bin/index', {html: renderToString()});
});

//app.listen(3030);
