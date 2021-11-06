import {Fragment, useState, useCallback} from 'react';
import {useAuthCall} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  FieldTextarea,
  FieldSwitch,
  FieldSelect,
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

import {senderPolicyOpts, memberPolicyOpts} from './opts';

const selectAPIEdit = (api) => api.mailinglist.group.list.edit;

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

const ManageSettings = ({list, creatorName, refresh}) => {
  const snackUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; List settings updated</SnackbarSurface>,
  );

  const [locked, lock, unlock] = useFormLock();

  const form = useForm({
    name: list.name,
    desc: list.desc,
    archive: list.archive,
    sender_policy: list.sender_policy,
    member_policy: list.member_policy,
  });

  const posthookEdit = useCallback(() => {
    lock();
    refresh();
    snackUpdate();
  }, [refresh, snackUpdate, lock]);
  const [edit, execEdit] = useAuthCall(
    selectAPIEdit,
    [list.creatorid, list.listname, form.state],
    {},
    {posthook: posthookEdit},
  );

  return (
    <Grid>
      <Column fullWidth md={16}>
        <Form formState={form.state} onChange={form.update} onSubmit={execEdit}>
          <Field
            className="field-disabled-solid"
            name="name"
            label="Name"
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldTextarea
            className="field-disabled-solid"
            name="desc"
            label="Description"
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSelect
            className="field-disabled-solid"
            name="sender_policy"
            label="Sender policy"
            options={senderPolicyOpts}
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSelect
            className="field-disabled-solid"
            name="member_policy"
            label="Member policy"
            options={memberPolicyOpts}
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSwitch
            className="field-disabled-solid"
            name="archive"
            label="Archive"
            danger
            hint="Archives the mailing list"
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
              <ButtonPrimary onClick={execEdit}>Update Settings</ButtonPrimary>
            </Fragment>
          )}
        </ButtonGroup>
        {edit.err && <p>{edit.err.message}</p>}
      </Column>
      <Column fullWidth md={8}>
        <h5>Listid</h5>
        <code>{list.listid}</code>
        <h5>Address</h5>
        <div>{`${creatorName}.${list.listname}`}</div>
        <p>
          Created <Time value={list.creation_time * 1000} />
        </p>
      </Column>
    </Grid>
  );
};

export default ManageSettings;
