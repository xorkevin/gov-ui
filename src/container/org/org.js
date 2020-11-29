import React, {Fragment, useState, useCallback} from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import {useResource} from '@xorkevin/substation';
import {useAuthCall} from '@xorkevin/turbine';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIOrg = (api) => api.orgs.name;
const selectAPIEdit = (api) => api.orgs.id.edit;

const useFormLock = () => {
  const [locked, setLocked] = useState(true);
  const lock = useCallback(() => {
    setLocked(true);
  }, [setLocked]);
  const unlock = useCallback(() => {
    setLocked(false);
  }, [setLocked]);
  return [locked, lock, unlock];
};

const OrgHeader = ({org}) => {
  return (
    <Fragment>
      <h3>
        {org.display_name} <small>@{org.name}</small>
      </h3>
      {org.desc && <p>{org.desc}</p>}
    </Fragment>
  );
};

const OrgMembers = ({org}) => {
  return (
    <Fragment>
      <OrgHeader org={org} />
    </Fragment>
  );
};

const OrgSettings = ({org}) => {
  const snackUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org updated</SnackbarSurface>,
  );

  const [locked, lock, unlock] = useFormLock();

  const form = useForm({
    name: org.name,
    display_name: org.display_name,
    desc: org.desc,
  });

  const posthookEdit = useCallback(() => {
    lock();
    snackUpdate();
  }, [snackUpdate, lock]);
  const [edit, execEdit] = useAuthCall(
    selectAPIEdit,
    [org.orgid, form.state],
    {},
    {posthook: posthookEdit},
  );

  return (
    <Fragment>
      <h3>Settings</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execEdit}
          >
            <Field
              className="org-field-disabled-solid"
              name="name"
              label="Name"
              hint="vanity url"
              disabled={locked}
              fullWidth
            />
            <Field
              className="org-field-disabled-solid"
              name="display_name"
              label="Display name"
              nohint
              disabled={locked}
              fullWidth
            />
            <Field
              className="org-field-disabled-solid"
              name="desc"
              label="Description"
              nohint
              disabled={locked}
              fullWidth
            />
          </Form>
          <ButtonGroup>
            {locked ? (
              <Fragment>
                <FaIcon icon="lock" />
                <ButtonTertiary onClick={unlock}>Edit</ButtonTertiary>
              </Fragment>
            ) : (
              <Fragment>
                <FaIcon icon="unlock-alt" />
                <ButtonTertiary onClick={lock}>Cancel</ButtonTertiary>
                <ButtonPrimary onClick={execEdit}>Update Org</ButtonPrimary>
              </Fragment>
            )}
          </ButtonGroup>
          {edit.err && <p>{edit.err}</p>}
        </Column>
        <Column fullWidth md={8}>
          <p>
            Created <Time value={org.creation_time * 1000} />
          </p>
        </Column>
      </Grid>
    </Fragment>
  );
};

const OrgDetails = () => {
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
                    <OrgMembers org={org.data} />
                  </Route>
                  <Route path={`${match.path}/settings`}>
                    <OrgSettings org={org.data} />
                  </Route>
                  <Redirect to={`${match.path}/members`} />
                </Switch>
              </Column>
            </Grid>
          )}
          {org.err && <span>{org.err}</span>}
        </Container>
      </Section>
    </MainContent>
  );
};

export default OrgDetails;
