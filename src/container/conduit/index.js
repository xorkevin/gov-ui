import {lazy, Suspense, useContext} from 'react';
import {Switch, Route, Redirect, Link, useRouteMatch} from 'react-router-dom';
import {
  MainContent,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';

const ConduitChat = lazy(() => import('./chat'));

const Conduit = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  return (
    <MainContent>
      <Grid>
        <Column fullWidth sm={2}>
          <Link to={ctx.pathHome}>
            <h4>
              <FaIcon icon="home" /> Home
            </h4>
          </Link>
          <Sidebar>
            <SidebarHeader>Conduit</SidebarHeader>
            <SidebarItem
              link={`${match.url}/chat`}
              local
              icon={<FaIcon icon="commenting" />}
            >
              DMs
            </SidebarItem>
          </Sidebar>
        </Column>
        <Column fullWidth sm={22}>
          <Suspense fallback={ctx.fallbackView}>
            <Switch>
              <Route path={`${match.path}/chat`}>
                <ConduitChat />
              </Route>
              <Redirect to={`${match.url}/chat`} />
            </Switch>
          </Suspense>
        </Column>
      </Grid>
    </MainContent>
  );
};

export default Conduit;
