import React from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {MainContent, Section, Container, Tabbar, TabItem} from '@xorkevin/nuke';

import AccountDetailsContainer from './details';
import AccountEditContainer from './detailsedit';
import EmailEditContainer from './emailedit';
import EmailConfirmContainer from './emailconfirm';
import PassEditContainer from './passedit';
//import ProfileEditContainer from './profileedit';
//import ProfileDetailsContainer from './profile';
//import AccountSessionsContainer from './sessions';

const Account = ({showProfile}) => {
  const match = useRouteMatch();

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <h1>Settings</h1>
          <Tabbar>
            <TabItem link={`${match.path}/account`} local>
              Account
            </TabItem>
            {showProfile && (
              <TabItem link={`${match.path}/profile`} local>
                Profile
              </TabItem>
            )}
            <TabItem link={`${match.path}/sessions`} local>
              Sessions
            </TabItem>
          </Tabbar>
          <Switch>
            <Route exact path={`${match.path}/account`}>
              <AccountDetailsContainer
                pathEdit={`${match.path}/account/edit`}
                pathEmail={`${match.path}/account/email`}
                pathPass={`${match.path}/account/pass`}
              />
            </Route>
            <Route exact path={`${match.path}/account/edit`}>
              <AccountEditContainer pathAccount={`${match.path}/account`} />
            </Route>
            <Route exact path={`${match.path}/account/email`}>
              <EmailEditContainer
                pathAccount={`${match.path}/account`}
                pathConfirm={`${match.path}/account/email/confirm`}
              />
            </Route>
            <Route path={`${match.path}/account/email/confirm`}>
              <EmailConfirmContainer pathAccount={`${match.path}/account`} />
            </Route>
            <Route path={`${match.path}/account/pass`}>
              <PassEditContainer pathAccount={`${match.path}/account`} />
            </Route>
            {/*{showProfile && (
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
            </Route>*/}
            <Redirect to={`${match.path}/account`} />
          </Switch>
        </Container>
      </Section>
    </MainContent>
  );
};

export {Account as default, Account};
