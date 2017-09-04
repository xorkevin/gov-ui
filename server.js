const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const hbsEngine = require('hbs').__express;
const {renderToString} = require('./bin_server/render');

const asString = renderToString();

const serveIndex = (req, res)=>{
  res.render('index', {html: asString});
};

const app = express();
app.set('views', 'bin');
app.set('view engine', 'html');
app.engine('html', hbsEngine);
app.use(compression());
app.use(morgan('dev'));
app.use('/index.html', serveIndex);
app.use('/', express.static('bin'));
app.use('/static', (req, res)=>{
  res.sendStatus(404);
});
app.get('/*', serveIndex);

app.listen(3030);
