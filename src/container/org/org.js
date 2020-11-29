import {lazy} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import {useResource} from '@xorkevin/substation';
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

const OrgMembers = lazy(() => import('./members'));
const OrgSettings = lazy(() => import('./settings'));

const selectAPIOrg = (api) => api.orgs.name;

const OrgDetails = ({pathOrg}) => {
  const match = useRouteMatch();
  const {name} = useParams();

  const [org] = useResource(selectAPIOrg, [name], {
    orgid: '',
    name: '',
    display_name: '',
    desc: '',
    creation_time: 0,
  });

  return (
    <MainContent>
      <Section>
        <Container padded narrow>
          {org.success && (
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
                  <SidebarItem
                    local
                    link={`${match.url}/settings`}
                    icon={<FaIcon icon="cog" />}
                  >
                    Settings
                  </SidebarItem>
                </Sidebar>
              </Column>
              <Column fullWidth sm={16} grow="1">
                <Switch>
                  <Route path={`${match.path}/members`}>
                    <OrgMembers name={name} />
                  </Route>
                  <Route path={`${match.path}/settings`}>
                    <OrgSettings
                      name={name}
                      pathOrgSettings={`${pathOrg}/settings`}
                    />
                  </Route>
                  <Redirect to={`${match.path}/members`} />
                </Switch>
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
