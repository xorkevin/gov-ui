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
                <h4>{org.data.display_name}</h4>
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
                      link={`${match.url}/settings`}
                      icon={<FaIcon icon="cog" />}
                    >
                      Settings
                    </SidebarItem>
                  )}
                </Sidebar>
              </Column>
              <Column fullWidth sm={16}>
                <Suspense fallback={ctx.fallbackView}>
                  <Switch>
                    <Route path={`${match.path}/members`}>
                      <OrgMembers org={org.data} isMod={isMod} />
                    </Route>
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
          {org.err && <p>{org.err}</p>}
        </Container>
      </Section>
    </MainContent>
  );
};

export default OrgDetails;
