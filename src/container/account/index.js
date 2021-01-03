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
const OrgsContainer = lazy(() => import('./orgs'));
const InvitationsContainer = lazy(() => import('./invitations'));

const DevApikeyContainer = lazy(() => import('./developer/apikey'));

const Account = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Settings</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/account`}
                  local
                  icon={<FaIcon icon="id-card-o" />}
                >
                  Account
                </SidebarItem>
                <SidebarItem
                  link={`${match.path}/security`}
                  local
                  icon={<FaIcon icon="lock" />}
                >
                  Security
                </SidebarItem>
                <SidebarItem
                  link={`${match.path}/orgs`}
                  local
                  icon={<FaIcon icon="sitemap" />}
                >
                  Organaizations
                </SidebarItem>
                <SidebarItem
                  link={`${match.path}/invitations`}
                  local
                  icon={<FaIcon icon="envelope-o" />}
                >
                  Invitations
                </SidebarItem>
                <SidebarDivider />
                <SidebarHeader>Developer</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/dev/apikey`}
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
                    <SecurityContainer
                      pathConfirm={`${match.path}/confirm/email`}
                    />
                  </Route>
                  <Route path={`${match.path}/confirm/email`}>
                    <EmailConfirmContainer
                      pathSecurity={`${match.path}/security`}
                    />
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
                  <Redirect to={`${match.path}/account`} />
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
