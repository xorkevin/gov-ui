const express = require('express');
const compression = require('compression');
const hbsEngine = require('hbs').__express;
const {renderToString} = require('./bin_server/render');

const asString = renderToString();

const app = express();
app.set('views', 'bin');
app.set('view engine', 'html');
app.engine('html', hbsEngine);
app.use(compression());
app.use('/static', express.static('bin/static'));
app.use('/static', express.static('public/static'));
app.get('/*', (req, res) => {
  res.render('index', {html: asString});
});

app.listen(3030);
