const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const {renderToString} = require('./bin_server/render');

const template = fs.readFileSync('bin/index.html', 'utf-8');
const binpath = path.resolve(__dirname, 'bin');

const serveFile = (app, filename)=>{
  app.get('/'+filename, (req, res)=>{
    res.sendFile(filename, {
      root: binpath,
    });
  });
};

const serveIndex = async (req, res, next)=>{
  try {
    res.set('Cache-Control', 'private, max-age=60');
    const {redirect, url, html, state} = await renderToString(req.url);
    if(redirect){
      res.redirect(302, url);
    } else {
      res.type('html');
      res.send(template.replace(`<div id="mount"></div>`, html));
    }
  } catch(e){
    next(e);
  }
};

const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use(morgan('dev'));
app.use('/static', express.static('bin/static', {
  fallthrough: false,
  maxAge: 31536000000,
}));
serveFile(app, 'service-worker.js');
serveFile(app, 'manifest.json');
app.get('/favicon.ico', (req, res)=>{
  res.sendStatus(404);
});
app.get('*', serveIndex);

app.listen(3030);
