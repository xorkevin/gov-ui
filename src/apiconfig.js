import profileAPI from './apiprofile';
import orgsAPI from './apiorgs';
import oauthAPI from './apioauth';
import courierAPI from './apicourier';

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

const GovAPI = Object.freeze({
  profile,
  orgs,
  oauth,
  courier,
});

export {GovAPI as default, GovAPI};
