const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const binpath = path.resolve(__dirname, 'bin');

const serveFile = (app, filename) => {
  app.get('/' + filename, (req, res) => {
    res.sendFile(filename, {
      root: binpath,
    });
  });
};

function start(port) {
  const app = express();
  app.disable('x-powered-by');
  app.use(compression());
  app.use(morgan('dev'));
  app.use(
    '/static',
    express.static('bin/static', {
      fallthrough: false,
      maxAge: 31536000000,
    }),
  );
  serveFile(app, 'manifest.json');
  serveFile(app, 'favicon.ico');
  app.get('*', (req, res) => {
    res.sendFile('index.html', {
      root: binpath,
    });
  });

  app.listen(port);
}

module.exports = start;
