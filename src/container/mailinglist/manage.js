import {Fragment, useCallback} from 'react';
import {useAuthValue, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ModalSurface,
  useModal,
  Field,
  FieldSelect,
  FieldSearchSelect,
  Form,
  useForm,
  usePaginate,
  ButtonGroup,
  FaIcon,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {useOrgOpts} from '../../component/accounts';

const LISTS_LIMIT = 32;

const selectAPILists = (api) => api.mailinglist.group.latest;
//const selectAPICreate = (api) => api.mailinglist.group.create;

const formValidCheck = ({listname, name}) => {
  const valid = {};
  if (listname.length > 0) {
    valid.listname = true;
  }
  if (name.length > 0) {
    valid.name = true;
  }
  return valid;
};

const senderPolicyOpts = [
  {display: 'Owner', value: 'owner'},
  {display: 'Member', value: 'member'},
  {display: 'User', value: 'user'},
];
const memberPolicyOpts = [
  {display: 'Owner', value: 'owner'},
  {display: 'User', value: 'user'},
];

const CreateList = ({close}) => {
  const form = useForm({
    listname: '',
    name: '',
    desc: '',
    sender_policy: 'owner',
    member_policy: 'owner',
  });

  return (
    <Fragment>
      <h4>Create new list</h4>
      <Form
        formState={form.state}
        onChange={form.update}
        validCheck={formValidCheck}
      >
        <Field name="listname" label="List address" nohint fullWidth />
        <Field name="name" label="Display name" nohint fullWidth />
        <Field name="desc" label="Description" nohint fullWidth />
        <FieldSelect
          name="sender_policy"
          label="Sender policy"
          options={senderPolicyOpts}
          nohint
          fullWidth
        />
        <FieldSelect
          name="member_policy"
          label="Member policy"
          options={memberPolicyOpts}
          nohint
          fullWidth
        />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Close</ButtonTertiary>
        <ButtonPrimary>Create List</ButtonPrimary>
      </ButtonGroup>
    </Fragment>
  );
};

const Manage = () => {
  const {userid} = useAuthValue();

  const form = useForm({
    accountid: userid,
  });
  const orgOpts = useOrgOpts();

  const paginate = usePaginate(LISTS_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookLists = useCallback(
    (_status, lists) => {
      setAtEnd(lists.length < LISTS_LIMIT);
    },
    [setAtEnd],
  );
  const [lists, _reexecute] = useAuthResource(
    selectAPILists,
    [form.state.accountid, LISTS_LIMIT, paginate.index],
    [],
    {posthook: posthookLists},
  );

  const modal = useModal();

  return (
    <div>
      <Grid justify="space-between" align="flex-end">
        <Column grow="1">
          <h3>Manage Lists</h3>
        </Column>
        <Column>
          <ButtonGroup>
            <ButtonTertiary
              forwardedRef={modal.anchorRef}
              onClick={modal.toggle}
            >
              <FaIcon icon="plus" /> New
            </ButtonTertiary>
          </ButtonGroup>
          {modal.show && (
            <ModalSurface size="md" anchor={modal.anchor} close={modal.close}>
              <CreateList close={modal.close} />
            </ModalSurface>
          )}
        </Column>
      </Grid>
      <hr />
      <Form formState={form.state} onChange={form.update}>
        <FieldSearchSelect
          name="accountid"
          options={orgOpts}
          label="Account"
          nohint
        />
      </Form>
      <pre>{JSON.stringify(lists.data)}</pre>
      <ButtonGroup>
        <ButtonTertiary disabled={paginate.atFirst} onClick={paginate.prev}>
          prev
        </ButtonTertiary>
        {paginate.page}
        <ButtonTertiary disabled={paginate.atLast} onClick={paginate.next}>
          next
        </ButtonTertiary>
      </ButtonGroup>
      {lists.err && <p>{lists.err.message}</p>}
    </div>
  );
};

export default Manage;
