const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const hbsEngine = require('hbs').__express;
const {renderToString} = require('./bin_server/render');

const binpath = path.resolve(__dirname, 'bin');

const serveFile = (app, filename)=>{
  app.get('/'+filename, (req, res)=>{
    res.sendFile(filename, {
      root: binpath,
    });
  });
};

const serveIndex = async (req, res)=>{
  const {redirect, url, html} = await renderToString(req.url);
  if(redirect){
    res.redirect(302, url);
  } else {
    res.render('index', {html: html});
  }
};

const app = express();
app.disable('x-powered-by');
app.set('views', 'bin');
app.set('view engine', 'html');
app.engine('html', hbsEngine);
app.use(compression());
app.use(morgan('dev'));
app.use('/static', express.static('bin/static', {
  fallthrough: false,
  maxAge: 31536000,
}));
serveFile(app, 'service-worker.js');
serveFile(app, 'manifest.json');
app.get('/favicon.ico', (req, res)=>{
  res.sendStatus(404);
});
app.get('/*', serveIndex);

app.listen(3030);
