import {lazy, Suspense, useMemo, useContext} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
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

const OrgMembers = lazy(() => import('./members'));
const OrgManage = lazy(() => import('./manage'));
const OrgInvitations = lazy(() => import('./invitations'));
const OrgSettings = lazy(() => import('./settings'));

const selectAPIOrg = (api) => api.orgs.name;

const OrgDetails = ({pathOrg}) => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();
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
                    link={`${match.url}/members`}
                    icon={<FaIcon icon="users" />}
                  >
                    Members
                  </SidebarItem>
                  {isMod && (
                    <SidebarItem
                      local
                      link={`${match.url}/manage`}
                      icon={<FaIcon icon="th-list" />}
                    >
                      Manage
                    </SidebarItem>
                  )}
                  {isMod && (
                    <SidebarItem
                      local
                      link={`${match.url}/invitations`}
                      icon={<FaIcon icon="envelope-o" />}
                    >
                      Invitations
                    </SidebarItem>
                  )}
                  {isMod && (
                    <SidebarItem
                      local
                      link={`${match.url}/settings`}
                      icon={<FaIcon icon="cog" />}
                    >
                      Settings
                    </SidebarItem>
                  )}
                </Sidebar>
              </Column>
              <Column fullWidth sm={16}>
                <h2>{org.data.display_name}</h2>
                <p>{org.data.desc}</p>
                <Suspense fallback={ctx.fallbackView}>
                  <Switch>
                    <Route path={`${match.path}/members`}>
                      <OrgMembers org={org.data} />
                    </Route>
                    {isMod && (
                      <Route path={`${match.path}/manage`}>
                        <OrgManage org={org.data} />
                      </Route>
                    )}
                    {isMod && (
                      <Route path={`${match.path}/invitations`}>
                        <OrgInvitations org={org.data} />
                      </Route>
                    )}
                    {isMod && (
                      <Route path={`${match.path}/settings`}>
                        <OrgSettings
                          org={org.data}
                          pathOrgSettings={`${pathOrg}/settings`}
                          refresh={reexecute}
                          pathHome={ctx.pathHome}
                        />
                      </Route>
                    )}
                    <Redirect to={`${match.path}/members`} />
                  </Switch>
                </Suspense>
              </Column>
            </Grid>
          )}
          {org.err && <p>{org.err.message}</p>}
        </Container>
      </Section>
    </MainContent>
  );
};

export default OrgDetails;
