import {Fragment, useState, useCallback} from 'react';
import {
  Grid,
  Column,
  Field,
  FieldTextarea,
  FieldSwitch,
  FieldSelect,
  Form,
  useForm,
  ButtonGroup,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {senderPolicyOpts, memberPolicyOpts} from './opts';

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

const ManageSettings = ({list, creatorName}) => {
  const [locked, lock, unlock] = useFormLock();

  const form = useForm({
    name: list.name,
    description: list.description,
    archive: list.archive,
    sender_policy: list.sender_policy,
    member_policy: list.member_policy,
  });

  return (
    <Grid>
      <Column fullWidth md={16}>
        <Form formState={form.state} onChange={form.update}>
          <Field
            className="mailinglist-field-disabled-solid"
            name="name"
            label="Name"
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldTextarea
            className="mailinglist-field-disabled-solid"
            name="description"
            label="Description"
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSelect
            className="mailinglist-field-disabled-solid"
            name="sender_policy"
            label="Sender policy"
            options={senderPolicyOpts}
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSelect
            className="mailinglist-field-disabled-solid"
            name="member_policy"
            label="Member policy"
            options={memberPolicyOpts}
            nohint
            disabled={locked}
            fullWidth
          />
          <FieldSwitch
            className="mailinglist-field-disabled-solid"
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
              <ButtonPrimary>Update Settings</ButtonPrimary>
            </Fragment>
          )}
        </ButtonGroup>
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
