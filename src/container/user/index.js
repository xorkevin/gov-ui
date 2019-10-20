import React, {lazy, Suspense} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import {Section} from '@xorkevin/nuke';

const UserDetailsContainer = lazy(() => import('container/user/user'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const User = () => {
  const match = useRouteMatch();

  return (
    <Suspense fallback={FallbackView}>
      <Switch>
        <Route path={`${match.path}/:username?`}>
          <UserDetailsContainer />
        </Route>
        <Redirect to={`${match.path}/`} />
      </Switch>
    </Suspense>
  );
};

export {User as default, User};
