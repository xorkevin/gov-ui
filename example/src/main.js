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
