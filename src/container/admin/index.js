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
  FaIcon,
} from '@xorkevin/nuke';

import OAuthAppContainer from './oauth';
import UsersContainer from './users';
import ApprovalsContainer from './approvals';

const Admin = () => {
  const match = useRouteMatch();

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Users</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/users`}
                  local
                  icon={<FaIcon icon="users" />}
                >
                  Users
                </SidebarItem>
                <SidebarItem
                  link={`${match.path}/approvals`}
                  local
                  icon={<FaIcon icon="inbox" />}
                >
                  Approvals
                </SidebarItem>
                <SidebarHeader>Integrations</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/oauth`}
                  local
                  icon={<FaIcon icon="openid" />}
                >
                  OAuth
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Switch>
                <Route path={`${match.path}/users`}>
                  <UsersContainer />
                </Route>
                <Route path={`${match.path}/approvals`}>
                  <ApprovalsContainer />
                </Route>
                <Route path={`${match.path}/oauth`}>
                  <OAuthAppContainer />
                </Route>
                <Redirect to={`${match.path}/users`} />
              </Switch>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export {Admin as default, Admin};
