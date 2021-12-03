import {lazy, Suspense, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
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
  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Users</SidebarHeader>
                <SidebarItem link="users" local icon={<FaIcon icon="users" />}>
                  Users
                </SidebarItem>
                <SidebarItem
                  link="invitations"
                  local
                  icon={<FaIcon icon="envelope-o" />}
                >
                  Invitations
                </SidebarItem>
                <SidebarItem
                  link="approvals"
                  local
                  icon={<FaIcon icon="inbox" />}
                >
                  Approvals
                </SidebarItem>
                <SidebarHeader>Integrations</SidebarHeader>
                {ctx.enableOAuth && (
                  <SidebarItem
                    link="oauth"
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
                <Routes>
                  <Route path="users/*" element={<UsersContainer />} />
                  <Route
                    path="invitations"
                    element={<InvitationsContainer />}
                  />
                  <Route path="approvals" element={<ApprovalsContainer />} />
                  {ctx.enableOAuth && (
                    <Route path="oauth" element={<OAuthAppContainer />} />
                  )}
                  <Route path="*" element={<Navigate to="users" replace />} />
                </Routes>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export {Admin as default, Admin};
