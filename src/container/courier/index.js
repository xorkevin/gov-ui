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
import {useAccountChooser, AccountForm} from '../../component/accounts';

const CourierLink = lazy(() => import('./link'));
const CourierBrand = lazy(() => import('./brand'));

const Courier = () => {
  const ctx = useContext(GovUICtx);

  const accounts = useAccountChooser();

  return (
    <MainContent>
      <Section>
        <Container padded>
          <Grid>
            <Column fullWidth md={6} lg={4}>
              <AccountForm accounts={accounts} />
              <Sidebar>
                <SidebarHeader>Courier</SidebarHeader>
                <SidebarItem link="link" local icon={<FaIcon icon="link" />}>
                  Links
                </SidebarItem>
                <SidebarItem link="brand" local icon={<FaIcon icon="shield" />}>
                  Brand
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18} lg={20}>
              <Suspense fallback={ctx.fallbackView}>
                <Routes>
                  <Route
                    path="link"
                    element={
                      <CourierLink
                        accountid={accounts.accountid}
                        courierPath={ctx.courierLinkPath}
                      />
                    }
                  />
                  <Route
                    path="brand"
                    element={<CourierBrand accountid={accounts.accountid} />}
                  />
                  <Route path="*" element={<Navigate to="link" replace />} />
                </Routes>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default Courier;
