import {makeAPIClient} from '@xorkevin/substation';
import {GovAuthAPI} from '@xorkevin/turbine';
import {GovAPI} from '@xorkevin/gov-ui';

const API = {
  setupz: GovAPI.setupz(),
  healthz: GovAPI.healthz(),
  turbine: GovAuthAPI.turbine('/u'),
  u: GovAPI.user('/u'),
  profile: GovAPI.profile('/profile'),
  orgs: GovAPI.orgs('/org'),
  oauth: GovAPI.oauth('/oauth'),
  courier: GovAPI.courier('/courier'),
};

const WELL_KNOWN = {
  wellknown: GovAPI.wellknown(),
};

const BASEOPTS = Object.freeze({
  credentials: 'include',
});

// eslint-disable-next-line no-undef
const baseUrl = APIBASE_URL;

const APIClient = Object.freeze(
  Object.assign(
    {},
    makeAPIClient(baseUrl, BASEOPTS, API),
    makeAPIClient('', BASEOPTS, WELL_KNOWN),
  ),
);

export {APIClient};
