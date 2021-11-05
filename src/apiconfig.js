import userAPI from './apiuser';
import apikeyAPI from './apiapikey';
import profileAPI from './apiprofile';
import orgsAPI from './apiorgs';
import oauthAPI from './apioauth';
import courierAPI from './apicourier';
import conduitAPI from './apiconduit';
import mailinglistAPI from './apimailinglist';

const user = (url = '/u') => ({
  url,
  children: {
    user: {
      url: '/user',
      children: userAPI,
    },
    apikey: {
      url: '/apikey',
      children: apikeyAPI,
    },
  },
});

const profile = (url = '/profile') => ({
  url,
  children: profileAPI,
});

const orgs = (url = '/org') => ({
  url,
  children: orgsAPI,
});

const oauth = (url = '/oauth') => ({
  url,
  children: oauthAPI,
});

const courier = (url = '/courier') => ({
  url,
  children: courierAPI,
});

const conduit = (url = '/conduit') => ({
  url,
  children: conduitAPI,
});

const mailinglist = (url = '/mailinglist') => ({
  url,
  children: mailinglistAPI,
});

const setupz = () => ({
  url: '/setupz',
  method: 'POST',
  transformer: (admin) => ({
    json: {
      admin,
    },
  }),
  expectjson: true,
  err: 'Could not run server setup',
});

const healthz = () => ({
  url: '/healthz',
  children: {
    live: {
      url: '/live',
      method: 'GET',
      expectjson: false,
      err: 'Could not get health report from api server',
    },
    ready: {
      url: '/ready',
      method: 'GET',
      expectjson: true,
      err: 'Could not get health report from api server',
    },
  },
});

const wellknown = () => ({
  url: '/.well-known',
  children: {
    openidconfig: {
      url: '/openid-configuration',
      method: 'GET',
      expectjson: true,
      err: 'Could not get openid configuration',
    },
  },
});

const GovAPI = Object.freeze({
  setupz,
  healthz,
  wellknown,
  user,
  profile,
  orgs,
  oauth,
  courier,
  conduit,
  mailinglist,
});

export default GovAPI;
