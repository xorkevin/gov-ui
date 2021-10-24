import {lazy} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

const ManageLists = lazy(() => import('./managelists'));
const ManageList = lazy(() => import('./managelist'));

const Manage = ({listurl}) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <ManageLists baseurl={match.url} listurl={listurl} />
      </Route>
      <Route path={`${match.path}/:listid`}>
        <ManageList />
      </Route>
      <Redirect to={match.url} />
    </Switch>
  );
};

export default Manage;
