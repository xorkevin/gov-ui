import {makeAPIClient} from '@xorkevin/substation';
import {userAPIConfig} from '@xorkevin/turbine';
import courierAPI from './courier';
import profileAPI from './profile';

const API = {
  setupz: {
    url: '/setupz',
    method: 'POST',
    expectdata: true,
    err: 'Could not run server setup',
  },
  healthz: {
    url: '/healthz',
    children: {
      check: {
        url: '/report',
        method: 'GET',
        expectdata: true,
        err: 'Could not get health report from api server',
      },
    },
  },
  u: {
    url: '/u',
    children: userAPIConfig,
  },
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
