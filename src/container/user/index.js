import {lazy} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

const UserDetailsContainer = lazy(() => import('./user'));

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
