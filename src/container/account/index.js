import React, {Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';

const EmailConfirmContainer = lazy(() =>
  import('container/account/emailconfirm'),
);
const EmailEditContainer = lazy(() => import('container/account/emailedit'));
const PassEditContainer = lazy(() => import('container/account/passedit'));
const AccountEditContainer = lazy(() =>
  import('container/account/detailsedit'),
);
const AccountDetailsContainer = lazy(() => import('container/account/details'));
const ProfileEditContainer = lazy(() =>
  import('container/account/profileedit'),
);
const ProfileDetailsContainer = lazy(() => import('container/account/profile'));
const AccountSessionsContainer = lazy(() =>
  import('container/account/sessions'),
);

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const Account = ({match}) => {
  return (
    <Section container narrow padded sectionTitle="Settings">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.path}/account`}>Account</NavLink>
            <NavLink to={`${match.path}/profile`}>Profile</NavLink>
            <NavLink to={`${match.path}/sessions`}>Sessions</NavLink>
          </Fragment>
        }
      />
      <Suspense fallback={FallbackView}>
        <Switch>
          <Route
            path={`${match.path}/account/email/confirm`}
            component={EmailConfirmContainer}
          />
          <Route
            path={`${match.path}/account/email`}
            component={EmailEditContainer}
          />
          <Route
            path={`${match.path}/account/pass`}
            component={PassEditContainer}
          />
          <Route
            path={`${match.path}/account/edit`}
            component={AccountEditContainer}
          />
          <Route
            path={`${match.path}/account`}
            component={AccountDetailsContainer}
          />
          <Route
            path={`${match.path}/profile/edit`}
            component={ProfileEditContainer}
          />
          <Route
            path={`${match.path}/profile`}
            component={ProfileDetailsContainer}
          />
          <Route
            path={`${match.path}/sessions`}
            component={AccountSessionsContainer}
          />
          <Redirect to={`${match.path}/account`} />
        </Switch>
      </Suspense>
    </Section>
  );
};

export default Account;
