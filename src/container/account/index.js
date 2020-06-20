import React, {Fragment} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar} from '@xorkevin/nuke';

import EmailConfirmContainer from './emailconfirm';
import EmailEditContainer from './emailedit';
import PassEditContainer from './passedit';
import AccountEditContainer from './detailsedit';
import AccountDetailsContainer from './details';
import ProfileEditContainer from './profileedit';
import ProfileDetailsContainer from './profile';
import AccountSessionsContainer from './sessions';

const Account = ({showProfile}) => {
  const match = useRouteMatch();

  return (
    <Section container narrow padded sectionTitle="Settings">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.path}/account`}>Account</NavLink>
            {showProfile && (
              <NavLink to={`${match.path}/profile`}>Profile</NavLink>
            )}
            <NavLink to={`${match.path}/sessions`}>Sessions</NavLink>
          </Fragment>
        }
      />
      <Switch>
        <Route path={`${match.path}/account/email/confirm`}>
          <EmailConfirmContainer />
        </Route>
        <Route path={`${match.path}/account/email`}>
          <EmailEditContainer />
        </Route>
        <Route path={`${match.path}/account/pass`}>
          <PassEditContainer />
        </Route>
        <Route path={`${match.path}/account/edit`}>
          <AccountEditContainer />
        </Route>
        <Route path={`${match.path}/account`}>
          <AccountDetailsContainer />
        </Route>
        {showProfile && (
          <Route path={`${match.path}/profile/edit`}>
            <ProfileEditContainer />
          </Route>
        )}
        {showProfile && (
          <Route path={`${match.path}/profile`}>
            <ProfileDetailsContainer />
          </Route>
        )}
        <Route path={`${match.path}/sessions`}>
          <AccountSessionsContainer />
        </Route>
        <Redirect to={`${match.path}/account`} />
      </Switch>
    </Section>
  );
};

export {Account as default, Account};
