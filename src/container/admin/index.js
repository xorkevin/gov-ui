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

const OAuthAppContainer = lazy(() => import('./oauth'));
const UsersContainer = lazy(() => import('./users'));
const InvitationsContainer = lazy(() => import('./invitations'));
const ApprovalsContainer = lazy(() => import('./approvals'));

const Admin = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Users</SidebarHeader>
                <SidebarItem
                  link={`${match.url}/users`}
                  local
                  icon={<FaIcon icon="users" />}
                >
                  Users
                </SidebarItem>
                <SidebarItem
                  link={`${match.url}/invitations`}
                  local
                  icon={<FaIcon icon="envelope-o" />}
                >
                  Invitations
                </SidebarItem>
                <SidebarItem
                  link={`${match.url}/approvals`}
                  local
                  icon={<FaIcon icon="inbox" />}
                >
                  Approvals
                </SidebarItem>
                <SidebarHeader>Integrations</SidebarHeader>
                {ctx.enableOAuth && (
                  <SidebarItem
                    link={`${match.url}/oauth`}
                    local
                    icon={<FaIcon icon="openid" />}
                  >
                    OAuth
                  </SidebarItem>
                )}
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Suspense fallback={ctx.fallbackView}>
                <Switch>
                  <Route path={`${match.path}/users`}>
                    <UsersContainer />
                  </Route>
                  <Route path={`${match.path}/invitations`}>
                    <InvitationsContainer />
                  </Route>
                  <Route path={`${match.path}/approvals`}>
                    <ApprovalsContainer />
                  </Route>
                  {ctx.enableOAuth && (
                    <Route path={`${match.path}/oauth`}>
                      <OAuthAppContainer />
                    </Route>
                  )}
                  <Redirect to={`${match.url}/users`} />
                </Switch>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export {Admin as default, Admin};
