const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const hbsEngine = require('hbs').__express;
const {renderToString} = require('./bin_server/render');

const asString = renderToString();

const app = express();
app.set('views', 'bin');
app.set('view engine', 'html');
app.engine('html', hbsEngine);
app.use(compression());
app.use(morgan('dev'));
app.use('/static', express.static('bin/static'));
app.use('/static', express.static('public/static'));
app.use('/static', function(req, res, next){
  res.sendStatus(404);
});
app.get('/service-worker.js', function(req, res, next){
  res.sendFile(path.resolve(__dirname, 'bin/service-worker.js'));
});
app.get('/*', (req, res) => {
  res.render('index', {html: asString});
});

app.listen(3030);
