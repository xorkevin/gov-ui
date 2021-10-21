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

const Manage = lazy(() => import('./list'));

const MailingLists = () => {
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
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Form formState={form.state} onChange={form.update}>
                <FieldSearchSelect
                  name="accountid"
                  options={orgOpts}
                  label="Account"
                  nohint
                />
              </Form>
              <Sidebar>
                <SidebarHeader>Mailing Lists</SidebarHeader>
                <SidebarItem
                  link={`${match.url}/manage`}
                  local
                  icon={<FaIcon icon="th-list" />}
                >
                  Manage
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Suspense fallback={ctx.fallbackView}>
                <Switch>
                  <Route path={`${match.path}/manage`}>
                    <Manage accountid={form.state.accountid} />
                  </Route>
                  <Redirect to={`${match.url}/manage`} />
                </Switch>
              </Suspense>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default MailingLists;
