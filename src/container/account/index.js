import React from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {MainContent, Section, Container, Tabbar, TabItem} from '@xorkevin/nuke';

//import EmailConfirmContainer from './emailconfirm';
//import EmailEditContainer from './emailedit';
//import PassEditContainer from './passedit';
//import AccountEditContainer from './detailsedit';
import AccountDetailsContainer from './details';
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
            {/*<Route path={`${match.path}/account/email/confirm`}>
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
            </Route>*/}
            <Route exact path={`${match.path}/account`}>
              <AccountDetailsContainer />
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
