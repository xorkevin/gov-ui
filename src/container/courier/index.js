import {lazy, Suspense, useMemo, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthResource} from '@xorkevin/turbine';
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

const CourierLink = lazy(() => import('./link'));
const CourierBrand = lazy(() => import('./brand'));

const selectAPIRoles = (api) => api.u.user.roles.get;
const selectAPIOrgs = (api) => api.orgs.get;

const ORG_LIMIT = 32;

const Courier = () => {
  const {userid, username} = useAuthValue();
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();

  const form = useForm({
    accountid: userid,
  });

  const [roles] = useAuthResource(
    selectAPIRoles,
    [ctx.orgUsrPrefix, ORG_LIMIT, 0],
    [],
  );
  const prefixLen = ctx.orgUsrPrefix.length;
  const orgids = useMemo(() => roles.data.map((i) => i.slice(prefixLen)), [
    prefixLen,
    roles,
  ]);
  const [orgs] = useAuthResource(
    orgids.length > 0 ? selectAPIOrgs : selectAPINull,
    [orgids],
    [],
  );
  const orgOpts = useMemo(
    () =>
      [{display: username, value: userid}].concat(
        orgs.data.map((i) => ({display: i.name, value: ctx.orgRole(i.orgid)})),
      ),
    [ctx, userid, username, orgs],
  );

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
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
            <Column fullWidth md={18}>
              <Form formState={form.state} onChange={form.update}>
                <FieldSearchSelect
                  name="accountid"
                  options={orgOpts}
                  label="Account"
                />
              </Form>
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
