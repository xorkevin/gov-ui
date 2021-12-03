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

const Dash = lazy(() => import('./dash'));
const OAuth = lazy(() => import('./oauth'));
const QRCode = lazy(() => import('./qrcode'));

const DevtoolsContainer = () => {
  const ctx = useContext(GovUICtx);
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
                  link="dash"
                  icon={<FaIcon icon="television" />}
                >
                  Dashboard
                </SidebarItem>
                <SidebarItem local link="oauth" icon={<FaIcon icon="openid" />}>
                  OAuth
                </SidebarItem>
                <SidebarItem
                  local
                  link="qrcode"
                  icon={<FaIcon icon="qrcode" />}
                >
                  QRCode
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18} lg={20}>
              <Suspense fallback={ctx.fallbackView}>
                <Routes>
                  <Route path="dash" element={<Dash />} />
                  <Route path="oauth/*" element={<OAuth />} />
                  <Route path="qrcode" element={<QRCode />} />
                  <Route path="*" element={<Navigate to="dash" replace />} />
                </Routes>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default DevtoolsContainer;
