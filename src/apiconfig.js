import oauthAPI from './apioauth';
import courierAPI from './apicourier';
import profileAPI from './apiprofile';

const oauth = (url = '/oauth') => ({
  url,
  children: oauthAPI,
});

const profile = (url = '/profile') => ({
  url,
  children: profileAPI,
});

const courier = (url = '/courier') => ({
  url,
  children: courierAPI,
});

const GovAPI = Object.freeze({
  oauth,
  profile,
  courier,
});

export {GovAPI as default, GovAPI};
