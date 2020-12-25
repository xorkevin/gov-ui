import {lazy, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import {GovUICtx} from '../../middleware';

const UserDetailsContainer = lazy(() => import('./user'));

const User = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:username`}>
        <UserDetailsContainer />
      </Route>
      <Redirect to={ctx.pathHome} />
    </Switch>
  );
};

export default User;
