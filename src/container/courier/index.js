import {lazy, Suspense, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useAuthValue} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  FieldSearchSelect,
  Form,
  useForm,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';
import {useOrgOpts} from '../../component/accounts';

const CourierLink = lazy(() => import('./link'));
const CourierBrand = lazy(() => import('./brand'));

const Courier = () => {
  const {userid} = useAuthValue();
  const ctx = useContext(GovUICtx);

  const form = useForm({
    accountid: userid,
  });

  const orgOpts = useOrgOpts();

  return (
    <MainContent>
      <Section>
        <Container padded>
          <Grid>
            <Column fullWidth md={6} lg={4}>
              <Form formState={form.state} onChange={form.update}>
                <FieldSearchSelect
                  name="accountid"
                  options={orgOpts}
                  label="Account"
                  nohint
                  fullWidth
                />
              </Form>
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
                        accountid={form.state.accountid}
                        courierPath={ctx.courierLinkPath}
                      />
                    }
                  />
                  <Route
                    path="brand"
                    element={<CourierBrand accountid={form.state.accountid} />}
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
