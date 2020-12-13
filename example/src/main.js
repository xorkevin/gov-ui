import 'fork-awesome/css/fork-awesome.min.css';
import 'inter-ui/inter.css';
import 'typeface-merriweather/index.css';
import 'main.scss';

import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import {APIMiddleware} from '@xorkevin/substation';
import {AuthMiddleware} from '@xorkevin/turbine';
import {
  ComposeMiddleware,
  DarkModeMiddleware,
  SnackbarMiddleware,
  MainContent,
  Section,
  Container,
} from '@xorkevin/nuke';
import platform from 'platform';

import {allRoles} from 'roles';
import App from 'app';
import {APIClient} from 'api';

const UnAuthFallback = (
  <MainContent>
    <Section>
      <Container padded narrow>
        <h4>Unauthorized</h4>
      </Container>
    </Section>
  </MainContent>
);

const FallbackView = (
  <MainContent>
    <Section>
      <Container padded narrow>
        <h4>Loading</h4>
      </Container>
    </Section>
  </MainContent>
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

const GovContextValue = Object.freeze({
  courierPath: COURIERBASE_URL,
});

const Middleware = ComposeMiddleware(
  APIMiddleware(APIClient),
  AuthMiddleware({fallbackView: UnAuthFallback, roleIntersect: allRoles}),
  DarkModeMiddleware(),
  SnackbarMiddleware(),
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
