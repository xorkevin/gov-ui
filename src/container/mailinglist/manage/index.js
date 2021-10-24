import {lazy} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

const Lists = lazy(() => import('./lists'));
const List = lazy(() => import('./list'));

const Manage = ({listurl}) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <Lists baseurl={match.url} listurl={listurl} />
      </Route>
      <Route path={`${match.path}/:listid`}>
        <List />
      </Route>
      <Redirect to={match.url} />
    </Switch>
  );
};

export default Manage;
