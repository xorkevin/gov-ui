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

const Manage = lazy(() => import('./manage'));

const MailingLists = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();

  return (
    <MainContent>
      <Section>
        <Container padded>
          <Grid>
            <Column fullWidth md={6} lg={4}>
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
            <Column fullWidth md={18} lg={20}>
              <Suspense fallback={ctx.fallbackView}>
                <Switch>
                  <Route path={`${match.path}/manage`}>
                    <Manage />
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
