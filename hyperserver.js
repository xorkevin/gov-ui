const app = require('./server.js');
const adminApp = require('./adminserver.js');

if (process.env.NUKE_MODE === 'admin') {
  adminApp(3031);
} else {
  app(3030);
}
