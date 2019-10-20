import React, {Fragment, lazy, Suspense} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar} from '@xorkevin/nuke';

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

const Account = () => {
  const match = useRouteMatch();

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
          <Route path={`${match.path}/profile/edit`}>
            <ProfileEditContainer />
          </Route>
          <Route path={`${match.path}/profile`}>
            <ProfileDetailsContainer />
          </Route>
          <Route path={`${match.path}/sessions`}>
            <AccountSessionsContainer />
          </Route>
          <Redirect to={`${match.path}/account`} />
        </Switch>
      </Suspense>
    </Section>
  );
};

export default Account;
