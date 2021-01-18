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
  SidebarDivider,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';

const AccountDetailsContainer = lazy(() => import('./details'));
const SecurityContainer = lazy(() => import('./security'));
const EmailConfirmContainer = lazy(() => import('./emailconfirm'));
const OAuthContainer = lazy(() => import('./oauth'));
const OrgsContainer = lazy(() => import('./orgs'));
const InvitationsContainer = lazy(() => import('./invitations'));

const DevApikeyContainer = lazy(() => import('./developer/apikey'));

const Account = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  const pathConfirmEmail = `${match.url}/confirm/email`;
  const pathSecurity = `${match.url}/security`;
  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Settings</SidebarHeader>
                <SidebarItem
                  link={`${match.url}/account`}
                  local
                  icon={<FaIcon icon="id-card-o" />}
                >
                  Account
                </SidebarItem>
                <SidebarItem
                  link={`${match.url}/security`}
                  local
                  icon={<FaIcon icon="lock" />}
                >
                  Security
                </SidebarItem>
                <SidebarItem
                  link={`${match.url}/oauth`}
                  local
                  icon={<FaIcon icon="openid" />}
                >
                  Connected Apps
                </SidebarItem>
                <SidebarItem
                  link={`${match.url}/orgs`}
                  local
                  icon={<FaIcon icon="sitemap" />}
                >
                  Organaizations
                </SidebarItem>
                <SidebarItem
                  link={`${match.url}/invitations`}
                  local
                  icon={<FaIcon icon="envelope-o" />}
                >
                  Invitations
                </SidebarItem>
                <SidebarDivider />
                <SidebarHeader>Developer</SidebarHeader>
                <SidebarItem
                  link={`${match.url}/dev/apikey`}
                  local
                  icon={<FaIcon icon="code" />}
                >
                  API Keys
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Suspense fallback={ctx.fallbackView}>
                <Switch>
                  <Route path={`${match.path}/account`}>
                    <AccountDetailsContainer />
                  </Route>
                  <Route path={`${match.path}/security`}>
                    <SecurityContainer pathConfirm={pathConfirmEmail} />
                  </Route>
                  <Route path={`${match.path}/confirm/email`}>
                    <EmailConfirmContainer pathSecurity={pathSecurity} />
                  </Route>
                  <Route path={`${match.path}/oauth`}>
                    <OAuthContainer />
                  </Route>
                  <Route path={`${match.path}/invitations`}>
                    <InvitationsContainer />
                  </Route>
                  {ctx.enableUserOrgs && (
                    <Route path={`${match.path}/orgs`}>
                      <OrgsContainer />
                    </Route>
                  )}
                  <Route path={`${match.path}/dev/apikey`}>
                    <DevApikeyContainer />
                  </Route>
                  <Redirect to={`${match.url}/account`} />
                </Switch>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default Account;
