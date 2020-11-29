import {lazy} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

const OrgDetailsContainer = lazy(() => import('./org'));

const Org = ({pathHome}) => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:name`}>
        <OrgDetailsContainer />
      </Route>
      <Redirect to={pathHome} />
    </Switch>
  );
};

export default Org;
