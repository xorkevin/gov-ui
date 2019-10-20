import {makeAPIClient} from '@xorkevin/substation';
import {GovAuthAPI} from '@xorkevin/turbine';
import courierAPI from './courier';
import profileAPI from './profile';

const API = {
  setupz: GovAuthAPI.setupz(),
  healthz: GovAuthAPI.healthz(),
  u: GovAuthAPI.user('/u'),
  profile: {
    url: '/profile',
    children: profileAPI,
  },
  courier: {
    url: '/courier',
    children: courierAPI,
  },
};

const BASEOPTS = Object.freeze({
  credentials: 'include',
});

// eslint-disable-next-line no-undef
const baseUrl = APIBASE_URL;

const APIClient = makeAPIClient(baseUrl, BASEOPTS, API);

export {APIClient};
