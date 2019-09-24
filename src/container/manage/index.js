import React, {Fragment, lazy, Suspense} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';

const ManageUserContainer = lazy(() => import('container/manage/user'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const ManageContainer = () => {
  const match = useRouteMatch();

  return (
    <Section container narrow padded sectionTitle="Settings">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.url}/user`}>User</NavLink>
          </Fragment>
        }
      />
      <Suspense fallback={FallbackView}>
        <Switch>
          <Route path={`${match.path}/user/:username?`}>
            <ManageUserContainer />
          </Route>
          <Redirect to={`${match.path}/user`} />
        </Switch>
      </Suspense>
    </Section>
  );
};

export default ManageContainer;
