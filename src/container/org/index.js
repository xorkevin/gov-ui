import {lazy, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import {GovUICtx} from '../../middleware';

const OrgDetailsContainer = lazy(() => import('./org'));

const Org = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/:name`}>
        <OrgDetailsContainer pathOrg={`${match.url}/{0}`} />
      </Route>
      <Redirect to={ctx.pathHome} />
    </Switch>
  );
};

export default Org;
