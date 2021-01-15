import {lazy, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import {GovUICtx} from '../../middleware';

const AuthContainer = lazy(() => import('./auth'));

const OAuth = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/auth`}>
        <AuthContainer />
      </Route>
      <Redirect to={ctx.pathHome} />
    </Switch>
  );
};

export default OAuth;
