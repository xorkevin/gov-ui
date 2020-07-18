import React, {Fragment} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar} from '@xorkevin/nuke';

import ManageUserContainer from './user';
import ApprovalsContainer from './approvals';

const Manage = () => {
  const match = useRouteMatch();

  return (
    <Section container narrow padded sectionTitle="Manage">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.url}/user`}>User</NavLink>
            <NavLink to={`${match.url}/approvals`}>Approvals</NavLink>
          </Fragment>
        }
      />
      <Switch>
        <Route path={`${match.path}/user/:username?`}>
          <ManageUserContainer />
        </Route>
        <Route path={`${match.path}/approvals`}>
          <ApprovalsContainer />
        </Route>
        <Redirect to={`${match.path}/user`} />
      </Switch>
    </Section>
  );
};

export {Manage as default, Manage};
