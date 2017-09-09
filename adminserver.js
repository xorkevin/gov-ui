const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const {renderToString, renderAdminToString} = require('./bin_server/render');

const template = fs.readFileSync('bin_admin/index.html', 'utf-8');
const binpath = path.resolve(__dirname, 'bin_admin');

const serveFile = (app, filename)=>{
  app.get('/'+filename, (req, res)=>{
    res.sendFile(filename, {
      root: binpath,
    });
  });
};

const serveAdmin = (req, res, next)=>{
  const props = {};
  res.set('Cache-Control', 'private, max-age=0');
  const {redirect, url, html, state} = renderAdminToString(req.url, props);
  if(redirect){
    res.redirect(302, url);
  } else {
    res.type('html');
    res.send(template.replace(`<div id="mount"></div>`, html));
  }
};

const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use(morgan('dev'));
app.use('/static', express.static('bin_admin/static', {
  fallthrough: false,
  maxAge: 31536000000,
}));
serveFile(app, 'service-worker.js');
serveFile(app, 'manifest.json');
app.get('/favicon.ico', (req, res)=>{
  res.sendStatus(404);
});
app.get('*', serveAdmin);

app.listen(3031);
