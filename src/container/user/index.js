import React from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import UserDetailsContainer from 'container/user/user';

const User = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:username?`}>
        <UserDetailsContainer />
      </Route>
      <Redirect to={`${match.path}/`} />
    </Switch>
  );
};

export {User as default, User};
