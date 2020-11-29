import React from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import UserDetailsContainer from './user';

const User = ({pathHome}) => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:username`}>
        <UserDetailsContainer />
      </Route>
      <Redirect to={pathHome} />
    </Switch>
  );
};

export default User;
