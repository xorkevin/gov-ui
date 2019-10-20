import courierAPI from './apicourier';
import profileAPI from './apiprofile';

const profile = (url = '/profile') => ({
  url,
  children: profileAPI,
});

const courier = (url = '/courier') => ({
  url,
  children: courierAPI,
});

const GovAPI = Object.freeze({
  profile,
  courier,
});

export {GovAPI as default, GovAPI};
