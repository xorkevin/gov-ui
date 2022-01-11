import {lazy, Suspense, useContext} from 'react';
import {Routes, Route, Navigate, useHref} from 'react-router-dom';
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
  const matchURL = useHref('');
  const pathConfirmEmail = `${matchURL}/confirm/email`;
  const pathSecurity = `${matchURL}/security`;
  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Settings</SidebarHeader>
                <SidebarItem
                  link="account"
                  local
                  icon={<FaIcon icon="id-card-o" />}
                >
                  Account
                </SidebarItem>
                <SidebarItem
                  link="security"
                  local
                  icon={<FaIcon icon="lock" />}
                >
                  Security
                </SidebarItem>
                {ctx.enableOAuth && (
                  <SidebarItem
                    link="oauth"
                    local
                    icon={<FaIcon icon="openid" />}
                  >
                    Connected Apps
                  </SidebarItem>
                )}
                {ctx.enableUserOrgs && (
                  <SidebarItem
                    link="orgs"
                    local
                    icon={<FaIcon icon="sitemap" />}
                  >
                    Organizations
                  </SidebarItem>
                )}
                <SidebarItem
                  link="invitations"
                  local
                  icon={<FaIcon icon="envelope-o" />}
                >
                  Invitations
                </SidebarItem>
                <SidebarDivider />
                <SidebarHeader>Developer</SidebarHeader>
                <SidebarItem
                  link="dev/apikey"
                  local
                  icon={<FaIcon icon="code" />}
                >
                  API Keys
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Suspense fallback={ctx.fallbackView}>
                <Routes>
                  <Route path="account" element={<AccountDetailsContainer />} />
                  <Route
                    path="security"
                    element={
                      <SecurityContainer pathConfirm={pathConfirmEmail} />
                    }
                  />
                  <Route
                    path="confirm/email"
                    element={
                      <EmailConfirmContainer pathSecurity={pathSecurity} />
                    }
                  />
                  {ctx.enableOAuth && (
                    <Route path="oauth" element={<OAuthContainer />} />
                  )}
                  <Route
                    path="invitations"
                    element={<InvitationsContainer />}
                  />
                  {ctx.enableUserOrgs && (
                    <Route path="orgs" element={<OrgsContainer />} />
                  )}
                  <Route path="dev/apikey" element={<DevApikeyContainer />} />
                  <Route path="*" element={<Navigate to="account" replace />} />
                </Routes>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default Account;
