import React, {Fragment} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar} from '@xorkevin/nuke';

import ManageUserContainer from 'container/manage/user';

const Manage = () => {
  const match = useRouteMatch();

  return (
    <Section container narrow padded sectionTitle="Settings">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.url}/user`}>User</NavLink>
          </Fragment>
        }
      />
      <Switch>
        <Route path={`${match.path}/user/:username?`}>
          <ManageUserContainer />
        </Route>
        <Redirect to={`${match.path}/user`} />
      </Switch>
    </Section>
  );
};

export {Manage as default, Manage};
