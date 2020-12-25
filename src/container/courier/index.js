import {lazy} from 'react';
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

const CourierLink = lazy(() => import('./link'));
const CourierBrand = lazy(() => import('./brand'));

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
                <Route path={`${match.path}/brand`}>
                  <CourierBrand />
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

export default Courier;
