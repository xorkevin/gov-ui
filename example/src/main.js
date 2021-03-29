import 'fork-awesome/css/fork-awesome.min.css';
import 'inter-ui/inter.css';
import 'typeface-merriweather/index.css';
import 'main.scss';

import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import {makeAPIClient, APIMiddleware} from '@xorkevin/substation';
import {GovAuthAPI, AuthMiddleware} from '@xorkevin/turbine';
import {
  ComposeMiddleware,
  DarkModeMiddleware,
  SnackbarMiddleware,
  MainContent,
  Section,
  Container,
} from '@xorkevin/nuke';
import {GovAPI, GovUIMiddleware} from '@xorkevin/gov-ui';
import platform from 'platform';

import {allRoles} from 'roles';
import App from 'app';

const UnAuthFallback = (
  <MainContent>
    <Section>
      <Container padded narrow>
        <h4>Unauthorized</h4>
      </Container>
    </Section>
  </MainContent>
);

const authMiddleware = AuthMiddleware({
  fallbackView: UnAuthFallback,
  roleIntersect: allRoles,
  pathHome: '/',
  pathLogin: '/x/login',
});

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

const apiCredentialsMiddleware = (transform) => (...args) => {
  const req = transform(...args);
  req.opts = Object.assign({credentials: 'same-origin'}, req.opts);
  return req;
};

// eslint-disable-next-line no-undef
const baseUrl = window.location.origin + APIBASE_URL;

const apiMiddleware = APIMiddleware(
  Object.freeze(
    Object.assign(
      {},
      makeAPIClient(baseUrl, API, {
        transform: [
          apiCredentialsMiddleware,
          authMiddleware.apiTransformMiddleware,
        ],
      }),
      makeAPIClient(window.location.origin, WELL_KNOWN),
    ),
  ),
);

const MainFallbackView = (
  <MainContent>
    <Section>
      <Container padded narrow>
        <h4>Loading</h4>
      </Container>
    </Section>
  </MainContent>
);

const FallbackView = (
  <Container padded narrow>
    <h4>Loading</h4>
  </Container>
);

const mobileSet = new Set(['Android', 'iOS']);
const parsePlatform = (user_agent) => {
  const info = platform.parse(user_agent);
  return {
    name: info.name,
    os: info.os.toString(),
    mobile: mobileSet.has(info.os.family),
  };
};

const Middleware = ComposeMiddleware(
  apiMiddleware,
  authMiddleware,
  DarkModeMiddleware(),
  SnackbarMiddleware(),
  GovUIMiddleware({
    mainFallbackView: MainFallbackView,
    fallbackView: FallbackView,
    pathHome: '/',
    pathLogin: '/x/login',
    pathAccount: '/a',
    userSessionParsePlatform: parsePlatform,
    // eslint-disable-next-line no-undef
    courierLinkPath: COURIERBASE_URL,
  }),
);

ReactDOM.render(
  <RecoilRoot initializeState={Middleware.initState}>
    <Middleware.ctxProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Middleware.ctxProvider>
  </RecoilRoot>,
  document.getElementById('mount'),
);
