import React, {Fragment} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar} from '@xorkevin/nuke';

import EmailConfirmContainer from 'container/account/emailconfirm';
import EmailEditContainer from 'container/account/emailedit';
import PassEditContainer from 'container/account/passedit';
import AccountEditContainer from 'container/account/detailsedit';
import AccountDetailsContainer from 'container/account/details';
import ProfileEditContainer from 'container/account/profileedit';
import ProfileDetailsContainer from 'container/account/profile';
import AccountSessionsContainer from 'container/account/sessions';

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
