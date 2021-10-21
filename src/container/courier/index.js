import {lazy, Suspense, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
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
  const match = useRouteMatch();

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
                <SidebarItem
                  link={`${match.url}/link`}
                  local
                  icon={<FaIcon icon="link" />}
                >
                  Links
                </SidebarItem>
                <SidebarItem
                  link={`${match.url}/brand`}
                  local
                  icon={<FaIcon icon="shield" />}
                >
                  Brand
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18} lg={20}>
              <Suspense fallback={ctx.fallbackView}>
                <Switch>
                  <Route path={`${match.path}/link`}>
                    <CourierLink
                      accountid={form.state.accountid}
                      courierPath={ctx.courierLinkPath}
                    />
                  </Route>
                  <Route path={`${match.path}/brand`}>
                    <CourierBrand accountid={form.state.accountid} />
                  </Route>
                  <Redirect to={`${match.url}/link`} />
                </Switch>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default Courier;
