import {lazy, Suspense, useMemo, useContext} from 'react';
import {Routes, Route, Navigate, useParams} from 'react-router-dom';
import {useResource} from '@xorkevin/substation';
import {useIntersectRoles} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  FaIcon,
} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';

const OrgOverview = lazy(() => import('./overview'));
const OrgMembers = lazy(() => import('./members'));
const OrgManage = lazy(() => import('./manage'));
const OrgInvitations = lazy(() => import('./invitations'));
const OrgSettings = lazy(() => import('./settings'));

const selectAPIOrg = (api) => api.orgs.name;

const Org = ({pathOrg}) => {
  const ctx = useContext(GovUICtx);
  const {name} = useParams();

  const [org, reexecute] = useResource(selectAPIOrg, [name], {
    orgid: '',
    name: '',
    display_name: '',
    desc: '',
    creation_time: 0,
  });

  const orgid = org.data.orgid;
  const usrRole = ctx.orgUsrRole(orgid);
  const modRole = ctx.orgModRole(orgid);
  const orgRoles = useMemo(() => {
    if (!orgid || orgid === '') {
      return [];
    }
    return [usrRole, modRole];
  }, [orgid, usrRole, modRole]);

  const [roles] = useIntersectRoles(orgRoles);
  const roleSet = useMemo(() => {
    if (!roles.success) {
      return new Set();
    }
    return new Set(roles.data);
  }, [roles]);

  const isMod = roleSet.has(modRole);

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          {org.success && roles.success && (
            <Grid>
              <Column fullWidth md={6}>
                <h4>{org.data.name}</h4>
                <Sidebar>
                  <SidebarItem
                    local
                    link="overview"
                    icon={<FaIcon icon="square" />}
                  >
                    Overview
                  </SidebarItem>
                  <SidebarItem
                    local
                    link="members"
                    icon={<FaIcon icon="users" />}
                  >
                    Members
                  </SidebarItem>
                  {isMod && (
                    <SidebarItem
                      local
                      link="manage"
                      icon={<FaIcon icon="th-list" />}
                    >
                      Manage
                    </SidebarItem>
                  )}
                  {isMod && (
                    <SidebarItem
                      local
                      link="invitations"
                      icon={<FaIcon icon="envelope-o" />}
                    >
                      Invitations
                    </SidebarItem>
                  )}
                  {isMod && (
                    <SidebarItem
                      local
                      link="settings"
                      icon={<FaIcon icon="cog" />}
                    >
                      Settings
                    </SidebarItem>
                  )}
                </Sidebar>
              </Column>
              <Column fullWidth md={18}>
                <Suspense fallback={ctx.fallbackView}>
                  <Routes>
                    <Route
                      path="overview"
                      element={<OrgOverview org={org.data} />}
                    />
                    <Route
                      path="members/*"
                      element={<OrgMembers org={org.data} />}
                    />
                    {isMod && (
                      <Route
                        path="manage"
                        element={<OrgManage org={org.data} />}
                      />
                    )}
                    {isMod && (
                      <Route
                        path="invitations"
                        element={<OrgInvitations org={org.data} />}
                      />
                    )}
                    {isMod && (
                      <Route
                        path="settings"
                        element={
                          <OrgSettings
                            org={org.data}
                            pathOrgSettings={`${pathOrg}/settings`}
                            refresh={reexecute}
                            pathHome={ctx.pathHome}
                          />
                        }
                      />
                    )}
                    <Route
                      path="*"
                      element={<Navigate to="overview" replace />}
                    />
                  </Routes>
                </Suspense>
              </Column>
            </Grid>
          )}
          {org.err && <p>{org.err.message}</p>}
          {roles.err && <p>{roles.err.message}</p>}
        </Container>
      </Section>
    </MainContent>
  );
};

export default Org;
