import {lazy, Suspense, useContext} from 'react';
import {Routes, Route, Navigate, useHref} from 'react-router-dom';
import {
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../../middleware';

const Lists = lazy(() => import('./lists'));
const List = lazy(() => import('./list'));
const Subs = lazy(() => import('./subs'));

const Manage = ({listurl}) => {
  const ctx = useContext(GovUICtx);
  const matchURL = useHref('');

  return (
    <Container padded narrow>
      <Grid>
        <Column fullWidth md={6}>
          <Sidebar>
            <SidebarHeader>Mailing Lists</SidebarHeader>
            <SidebarItem link="admin" local icon={<FaIcon icon="th-list" />}>
              Manage
            </SidebarItem>
            <SidebarItem link="subs" local icon={<FaIcon icon="newspaper-o" />}>
              Subscriptions
            </SidebarItem>
          </Sidebar>
        </Column>
        <Column fullWidth md={18}>
          <Suspense fallback={ctx.fallbackView}>
            <Routes>
              <Route
                path="admin"
                element={
                  <Lists baseurl={`${matchURL}/admin`} listurl={listurl} />
                }
              />
              <Route
                path="admin/:listid/*"
                element={<List listurl={listurl} baseurl={matchURL} />}
              />
              <Route path="subs" element={<Subs listurl={listurl} />} />
              <Route path="*" element={<Navigate to="admin" replace />} />
            </Routes>
          </Suspense>
        </Column>
      </Grid>
    </Container>
  );
};

export default Manage;
