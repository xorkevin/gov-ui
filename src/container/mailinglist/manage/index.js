import {lazy, Suspense, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../../middleware';

const Lists = lazy(() => import('./lists'));
const List = lazy(() => import('./list'));
const Subs = lazy(() => import('./subs'));

const Manage = ({listurl}) => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();

  return (
    <Container padded narrow>
      <Grid>
        <Column fullWidth md={6}>
          <Sidebar>
            <SidebarHeader>Mailing Lists</SidebarHeader>
            <SidebarItem
              link={`${match.url}/admin`}
              local
              icon={<FaIcon icon="th-list" />}
            >
              Manage
            </SidebarItem>
            <SidebarItem
              link={`${match.url}/subs`}
              local
              icon={<FaIcon icon="newspaper-o" />}
            >
              Subscriptions
            </SidebarItem>
          </Sidebar>
        </Column>
        <Column fullWidth md={18}>
          <Suspense fallback={ctx.fallbackView}>
            <Switch>
              <Route exact path={`${match.path}/admin`}>
                <Lists baseurl={`${match.url}/admin`} listurl={listurl} />
              </Route>
              <Route path={`${match.path}/admin/:listid`}>
                <List listurl={listurl} baseurl={match.url} />
              </Route>
              <Route path={`${match.path}/subs`}>
                <Subs listurl={listurl} />
              </Route>
              <Redirect to={`${match.url}/admin`} />
            </Switch>
          </Suspense>
        </Column>
      </Grid>
    </Container>
  );
};

export default Manage;
