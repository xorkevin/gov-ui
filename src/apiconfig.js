import userAPI from './apiuser';
import apikeyAPI from './apiapikey';
import profileAPI from './apiprofile';
import orgsAPI from './apiorgs';
import oauthAPI from './apioauth';
import courierAPI from './apicourier';

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

const setupz = () => ({
  url: '/setupz',
  method: 'POST',
  expectdata: true,
  err: 'Could not run server setup',
});

const healthz = () => ({
  url: '/healthz',
  children: {
    live: {
      url: '/live',
      method: 'GET',
      expectdata: false,
      err: 'Could not get health report from api server',
    },
    ready: {
      url: '/ready',
      method: 'GET',
      expectdata: true,
      err: 'Could not get health report from api server',
    },
  },
});

const GovAPI = Object.freeze({
  setupz,
  healthz,
  user,
  profile,
  orgs,
  oauth,
  courier,
});

export default GovAPI;
