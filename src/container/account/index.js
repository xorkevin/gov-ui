import React from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  SidebarDivider,
  FaIcon,
} from '@xorkevin/nuke';

import AccountDetailsContainer from './details';
import SecurityContainer from './security';
import EmailConfirmContainer from './emailconfirm';

import DevApikeyContainer from './developer/apikey';

const Account = ({showProfile, parsePlatform}) => {
  const match = useRouteMatch();

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column md={6}>
              <Sidebar>
                <SidebarHeader>Settings</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/account`}
                  local
                  icon={<FaIcon icon="address-card-o" />}
                >
                  Account
                </SidebarItem>
                <SidebarItem
                  link={`${match.path}/security`}
                  local
                  icon={<FaIcon icon="lock" />}
                >
                  Security
                </SidebarItem>
                <SidebarDivider />
                <SidebarHeader>Developer</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/dev/apikey`}
                  local
                  icon={<FaIcon icon="code" />}
                >
                  API Keys
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column md={18}>
              <Switch>
                <Route path={`${match.path}/account`}>
                  <AccountDetailsContainer showProfile={showProfile} />
                </Route>
                <Route path={`${match.path}/security`}>
                  <SecurityContainer
                    pathConfirm={`${match.path}/confirm/email`}
                    parsePlatform={parsePlatform}
                  />
                </Route>
                <Route path={`${match.path}/confirm/email`}>
                  <EmailConfirmContainer
                    pathSecurity={`${match.path}/security`}
                  />
                </Route>
                <Route path={`${match.path}/dev/apikey`}>
                  <DevApikeyContainer />
                </Route>
                <Redirect to={`${match.path}/account`} />
              </Switch>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export {Account as default, Account};
