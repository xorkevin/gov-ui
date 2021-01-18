import {Fragment, useState, useCallback, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
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
import ButtonDanger from '@xorkevin/nuke/src/component/button/danger';
import {formatURL} from '../../utility';

const selectAPIEdit = (api) => api.orgs.id.edit;
const selectAPIDel = (api) => api.orgs.id.del;

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

const OrgSettings = ({org, pathOrgSettings, refresh, pathHome}) => {
  const history = useHistory();
  const snackUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org updated</SnackbarSurface>,
  );
  const snackDel = useSnackbarView(
    <SnackbarSurface>&#x2713; Org deleted</SnackbarSurface>,
  );

  const [locked, lock, unlock] = useFormLock();
  const [dangerLocked, dangerLock, dangerUnlock] = useFormLock();

  const form = useForm({
    name: org.name,
    display_name: org.display_name,
    desc: org.desc,
  });

  const formNameRef = useRef('');
  formNameRef.current = form.state.name;

  const posthookEdit = useCallback(() => {
    lock();
    snackUpdate();
    if (formNameRef.current !== org.name) {
      history.push(formatURL(pathOrgSettings, formNameRef.current));
    } else {
      refresh();
    }
  }, [history, pathOrgSettings, org, formNameRef, refresh, snackUpdate, lock]);
  const [edit, execEdit] = useAuthCall(
    selectAPIEdit,
    [org.orgid, form.state],
    {},
    {posthook: posthookEdit},
  );

  const posthookDel = useCallback(() => {
    snackDel();
    history.push(pathHome);
  }, [history, pathHome, snackDel]);
  const [delOrg, execDel] = useAuthCall(
    selectAPIDel,
    [org.orgid],
    {},
    {posthook: posthookDel},
  );

  return (
    <div>
      <h3>Organization Settings</h3>
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
          {edit.err && <p>{edit.err.message}</p>}
        </Column>
        <Column fullWidth md={8}>
          <h5>Org ID</h5>
          <code>{org.orgid}</code>
          <p>
            Created <Time value={org.creation_time * 1000} />
          </p>
        </Column>
      </Grid>
      <h3>Danger Zone</h3>
      <hr />
      <Grid>
        <Column fullWidth>
          <Grid justify="space-between" align="center" nowrap>
            <Column>
              <h5>Delete this organization</h5>
              <p>
                This will delete this organization and remove all its moderator
                and member associations. This cannot be undone.
              </p>
            </Column>
            <Column shrink="0">
              <ButtonDanger onClick={execDel} disabled={dangerLocked}>
                Delete this organization
              </ButtonDanger>
            </Column>
          </Grid>
          <ButtonGroup>
            {dangerLocked ? (
              <Fragment>
                <FaIcon icon="lock" />
                <ButtonTertiary onClick={dangerUnlock}>Unlock</ButtonTertiary>
              </Fragment>
            ) : (
              <Fragment>
                <FaIcon icon="unlock-alt" />
                <ButtonTertiary onClick={dangerLock}>Cancel</ButtonTertiary>
              </Fragment>
            )}
          </ButtonGroup>
          {delOrg.err && <p>{delOrg.err.message}</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default OrgSettings;
