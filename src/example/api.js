import {makeAPIClient} from '@xorkevin/substation';
import {GovAuthAPI} from '@xorkevin/turbine';
import {GovAPI} from 'apiconfig';

const userApi = GovAuthAPI.user('/u');

userApi.children.apikey = {
  url: '/apikey',
  children: {
    get: {
      url: '?amount={0}&offset={1}',
      method: 'GET',
      transformer: (amount, offset) => [[amount, offset], null],
      expectdata: true,
      selector: (_status, data) => data && data.apikeys,
      err: 'Could not get apikeys',
    },
    create: {
      url: '',
      method: 'POST',
      expectdata: true,
      err: 'Could not create apikey',
    },
    id: {
      url: '/id/{0}',
      children: {
        edit: {
          url: '',
          method: 'PUT',
          transformer: (keyid, props) => [[keyid], props],
          expectdata: false,
          err: 'Could not edit apikey',
        },
        del: {
          url: '',
          method: 'DELETE',
          transformer: (keyid) => [[keyid], null],
          expectdata: false,
          err: 'Could not delete apikey',
        },
      },
    },
  },
};

const API = {
  setupz: GovAuthAPI.setupz(),
  healthz: GovAuthAPI.healthz(),
  u: userApi,
  profile: GovAPI.profile('/profile'),
  courier: GovAPI.courier('/courier'),
};

const BASEOPTS = Object.freeze({
  credentials: 'include',
});

// eslint-disable-next-line no-undef
const baseUrl = APIBASE_URL;

const APIClient = makeAPIClient(baseUrl, BASEOPTS, API);

export {APIClient};
