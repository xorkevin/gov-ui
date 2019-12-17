import {makeAPIClient} from '@xorkevin/substation';
import {GovAuthAPI} from '@xorkevin/turbine';
import {GovAPI} from 'apiconfig';

const userAPI = GovAuthAPI.user('/u');
userAPI.children.user.children.approvals = {
  url: '/approvals',
  children: {
    get: {
      url: '?amount={0}&offset={1}',
      method: 'GET',
      transformer: (amount, offset) => [[amount, offset], null],
      expectdata: true,
      selector: (_status, data) => data.approvals,
      err: 'Unable to get approvals',
    },
    id: {
      url: '/id/{0}',
      children: {
        approve: {
          url: '',
          method: 'POST',
          transformer: (userid) => [[userid], null],
          expectdata: false,
          err: 'Unable to approve request',
        },
        del: {
          url: '',
          method: 'DELETE',
          transformer: (userid) => [[userid], null],
          expectdata: false,
          err: 'Unable to delete request',
        },
      },
    },
  },
};

const API = {
  setupz: GovAuthAPI.setupz(),
  healthz: GovAuthAPI.healthz(),
  u: userAPI,
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
