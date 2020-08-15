//import React, {Fragment} from 'react';
//import {
//  Switch,
//  Route,
//  Redirect,
//  NavLink,
//  useRouteMatch,
//} from 'react-router-dom';
//import {Section, Tabbar, FaIcon} from '@xorkevin/nuke';
//
//const Courier = ({courierPath}) => {
//  const match = useRouteMatch();
//
//  return (
//    <Section container narrow padded sectionTitle="Courier">
//      <Tabbar
//        left={
//          <Fragment>
//            <NavLink to={`${match.url}/link`}>
//              <FaIcon icon="link" /> Link
//            </NavLink>
//            <NavLink to={`${match.url}/brand`}>
//              <FaIcon icon="shield" /> Brand
//            </NavLink>
//          </Fragment>
//        }
//      />
//      <Switch>
//        <Route path={`${match.path}/link`}>
//        </Route>
//        <Route path={`${match.path}/brand`}>
//          <CourierBrand />
//        </Route>
//        <Redirect to={`${match.path}/link`} />
//      </Switch>
//    </Section>
//  );
//};

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

import CourierLink from './link';
//import CourierBrand from './brand';

const Courier = ({courierPath}) => {
  const match = useRouteMatch();

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Courier</SidebarHeader>
                <SidebarItem
                  link={`${match.path}/link`}
                  local
                  icon={<FaIcon icon="link" />}
                >
                  Links
                </SidebarItem>
                <SidebarItem
                  link={`${match.path}/brand`}
                  local
                  icon={<FaIcon icon="shield" />}
                >
                  Brand
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Switch>
                <Route path={`${match.path}/link`}>
                  <CourierLink courierPath={courierPath} />
                </Route>
                <Redirect to={`${match.path}/link`} />
              </Switch>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export {Courier as default, Courier};
