import {Fragment, useState, useCallback, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {useResource} from '@xorkevin/substation';
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
import {formatStr} from '../../utility';

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

const OrgSettings = ({name, pathOrgSettings, refresh}) => {
  const history = useHistory();
  const snackUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org updated</SnackbarSurface>,
  );

  const [locked, lock, unlock] = useFormLock();

  const form = useForm({
    name: '',
    display_name: '',
    desc: '',
  });

  const formAssign = form.assign;
  const posthookOrg = useCallback(
    (_status, org) => {
      formAssign({
        name: org.name,
        display_name: org.display_name,
        desc: org.desc,
      });
    },
    [formAssign],
  );
  const [org] = useResource(
    selectAPIOrg,
    [name],
    {
      orgid: '',
      name: '',
      display_name: '',
      desc: '',
      creation_time: 0,
    },
    {posthook: posthookOrg},
  );

  const formNameRef = useRef('');
  formNameRef.current = form.state.name;

  const posthookEdit = useCallback(() => {
    lock();
    snackUpdate();
    if (formNameRef.current !== name) {
      history.push(formatStr(pathOrgSettings, formNameRef.current));
    } else {
      refresh();
    }
  }, [history, pathOrgSettings, name, formNameRef, refresh, snackUpdate, lock]);
  const [edit, execEdit] = useAuthCall(
    selectAPIEdit,
    [org.data.orgid, form.state],
    {},
    {posthook: posthookEdit},
  );

  return (
    <Fragment>
      <h3>Organization Settings</h3>
      <hr />
      {org.success && (
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
            <h5>Org ID</h5>
            <code>{org.data.orgid}</code>
            <p>
              Created <Time value={org.data.creation_time * 1000} />
            </p>
          </Column>
        </Grid>
      )}
      {org.err && <p>{org.err}</p>}
    </Fragment>
  );
};

export default OrgSettings;
