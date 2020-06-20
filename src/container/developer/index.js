import React, {Fragment} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar} from '@xorkevin/nuke';

import ApikeyContainer from './apikey';

const Developer = () => {
  const match = useRouteMatch();

  return (
    <Section container narrow padded sectionTitle="Developer settings">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.path}/apikey`}>API Keys</NavLink>
          </Fragment>
        }
      />
      <Switch>
        <Route path={`${match.path}/apikey`}>
          <ApikeyContainer />
        </Route>
        <Redirect to={`${match.path}/apikey`} />
      </Switch>
    </Section>
  );
};

export {Developer as default, Developer};
