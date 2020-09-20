import {makeAPIClient} from '@xorkevin/substation';
import {GovAuthAPI} from '@xorkevin/turbine';
import {GovAPI} from '@xorkevin/gov-ui/src/apiconfig';

const API = {
  setupz: GovAuthAPI.setupz(),
  healthz: GovAuthAPI.healthz(),
  u: GovAuthAPI.user('/u'),
  oauth: GovAPI.oauth('/oauth'),
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
