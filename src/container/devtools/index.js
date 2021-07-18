import {lazy, Suspense, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';

const Dash = lazy(() => import('./dash'));
const OAuth = lazy(() => import('./oauth'));
const QRCode = lazy(() => import('./qrcode'));

const DevtoolsContainer = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  return (
    <MainContent>
      <Section>
        <Container padded>
          <Grid>
            <Column fullWidth md={6} lg={4}>
              <Sidebar>
                <SidebarHeader>Devtools</SidebarHeader>
                <SidebarItem
                  local
                  link={`${match.url}/dash`}
                  icon={<FaIcon icon="television" />}
                >
                  Dashboard
                </SidebarItem>
                <SidebarItem
                  local
                  link={`${match.url}/oauth`}
                  icon={<FaIcon icon="openid" />}
                >
                  OAuth
                </SidebarItem>
                <SidebarItem
                  local
                  link={`${match.url}/qrcode`}
                  icon={<FaIcon icon="qrcode" />}
                >
                  QRCode
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18} lg={20}>
              <Suspense fallback={ctx.fallbackView}>
                <Switch>
                  <Route path={`${match.path}/dash`}>
                    <Dash />
                  </Route>
                  <Route path={`${match.path}/oauth`}>
                    <OAuth />
                  </Route>
                  <Route path={`${match.path}/qrcode`}>
                    <QRCode />
                  </Route>
                  <Redirect to={`${match.url}/dash`} />
                </Switch>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default DevtoolsContainer;
