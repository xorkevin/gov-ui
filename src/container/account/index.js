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
import OrgsContainer from './orgs';

import DevApikeyContainer from './developer/apikey';

const Account = ({
  showProfile,
  showOrgs,
  parsePlatform,
  allScopes,
  allScopeDesc,
  rolesToScopes,
}) => {
  const match = useRouteMatch();

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Settings</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/account`}
                  local
                  icon={<FaIcon icon="id-card-o" />}
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
                <SidebarItem
                  link={`${match.path}/orgs`}
                  local
                  icon={<FaIcon icon="sitemap" />}
                >
                  Organaizations
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
            <Column fullWidth md={18}>
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
                {showOrgs && (
                  <Route path={`${match.path}/orgs`}>
                    <OrgsContainer />
                  </Route>
                )}
                <Route path={`${match.path}/dev/apikey`}>
                  <DevApikeyContainer
                    allScopes={allScopes}
                    allScopeDesc={allScopeDesc}
                    rolesToScopes={rolesToScopes}
                  />
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
