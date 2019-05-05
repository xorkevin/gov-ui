import React, {Component} from 'react';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';

import Loader from 'loader';

const loadEmailConfirmContainer = Loader(() => {
  return import('container/account/emailconfirm');
});
const loadEmailEditContainer = Loader(() => {
  return import('container/account/emailedit');
});
const loadPassEditContainer = Loader(() => {
  return import('container/account/passedit');
});
const loadAccountEditContainer = Loader(() => {
  return import('container/account/detailsedit');
});
const loadAccountDetailsContainer = Loader(() => {
  return import('container/account/details');
});
const loadProfileEditContainer = Loader(() => {
  return import('container/account/profileedit');
});
const loadProfileDetailsContainer = Loader(() => {
  return import('container/account/profile');
});
const loadAccountSessionsContainer = Loader(() => {
  return import('container/account/sessions');
});

class Account extends Component {
  render({match}) {
    return (
      <Section container narrow padded sectionTitle="Settings">
        <Tabbar
          left={[
            {
              key: 'account',
              component: (
                <NavLink to={`${match.path}/account`}>Account</NavLink>
              ),
            },
            {
              key: 'profile',
              component: (
                <NavLink to={`${match.path}/profile`}>Profile</NavLink>
              ),
            },
            {
              key: 'sessions',
              component: (
                <NavLink to={`${match.path}/sessions`}>Sessions</NavLink>
              ),
            },
          ]}
        />
        <Switch>
          <Route
            path={`${match.path}/account/email/confirm/:key?`}
            component={loadEmailConfirmContainer}
          />
          <Route
            path={`${match.path}/account/email`}
            component={loadEmailEditContainer}
          />
          <Route
            path={`${match.path}/account/pass`}
            component={loadPassEditContainer}
          />
          <Route
            path={`${match.path}/account/edit`}
            component={loadAccountEditContainer}
          />
          <Route
            path={`${match.path}/account`}
            component={loadAccountDetailsContainer}
          />
          <Route
            path={`${match.path}/profile/edit`}
            component={loadProfileEditContainer}
          />
          <Route
            path={`${match.path}/profile`}
            component={loadProfileDetailsContainer}
          />
          <Route
            path={`${match.path}/sessions`}
            component={loadAccountSessionsContainer}
          />
          <Redirect to={`${match.path}/account`} />
        </Switch>
      </Section>
    );
  }
}

export default Account;
