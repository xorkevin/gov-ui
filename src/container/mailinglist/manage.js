import {Fragment, useCallback} from 'react';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  ModalSurface,
  useModal,
  useMenu,
  Menu,
  MenuItem,
  Field,
  FieldSelect,
  FieldSearchSelect,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
  Time,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {useOrgOpts} from '../../component/accounts';

const LISTS_LIMIT = 32;

const selectAPILists = (api) => api.mailinglist.group.latest;
const selectAPICreate = (api) => api.mailinglist.group.create;

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

const prehookValidate = ([accountid, form]) => {
  if (accountid.length === 0) {
    return {message: 'An account must be provided'};
  }
  const {listname, name} = form;
  if (listname.length === 0) {
    return {message: 'A list address must be provided'};
  }
  if (name.length === 0) {
    return {message: 'A list name must be provided'};
  }
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

const CreateList = ({accountid, posthookCreate, close}) => {
  const form = useForm({
    listname: '',
    name: '',
    desc: '',
    sender_policy: 'owner',
    member_policy: 'owner',
  });

  const posthook = useCallback(
    (status, data, opts) => {
      close();
      posthookCreate(status, data, opts);
    },
    [posthookCreate, close],
  );
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [accountid, form.state],
    {},
    {prehook: prehookValidate, posthook},
  );

  return (
    <Fragment>
      <h4>Create new list</h4>
      <Form
        formState={form.state}
        onChange={form.update}
        onSubmit={execCreate}
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
        <ButtonPrimary onClick={execCreate}>Create List</ButtonPrimary>
      </ButtonGroup>
      {create.err && <p>{create.err.message}</p>}
    </Fragment>
  );
};

const ListRow = ({listid, name, archive, lastUpdated}) => {
  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="account-org-item-name">
          <h5 className="account-org-item-heading">
            <AnchorText local href="#">
              {name}
            </AnchorText>{' '}
            <small>{listid}</small>
          </h5>
          <small>{archive && <Chip>Archived</Chip>}</small>
          <Time value={lastUpdated} />
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem local link="#">
                Settings
              </MenuItem>
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const Manage = () => {
  const {userid} = useAuthValue();

  const displaySnackbarCreate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org created</SnackbarSurface>,
  );

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
  const [lists, reexecute] = useAuthResource(
    selectAPILists,
    [form.state.accountid, LISTS_LIMIT, paginate.index],
    [],
    {posthook: posthookLists},
  );

  const posthookCreate = useCallback(
    (_status, _data, opts) => {
      displaySnackbarCreate();
      reexecute(opts);
    },
    [displaySnackbarCreate, reexecute],
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
              <CreateList
                accountid={form.state.accountid}
                posthookCreate={posthookCreate}
                close={modal.close}
              />
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
      <ListGroup>
        {Array.isArray(lists.data) &&
          lists.data.map((i) => (
            <ListRow
              key={i.listid}
              creatorid={i.creatorid}
              listname={i.listname}
              name={i.name}
              description={i.description}
              archive={i.archive}
              senderPolicy={i.sender_policy}
              memberPolicy={i.member_policy}
              lastUpdated={i.last_updated}
              creationTime={i.creation_time}
            />
          ))}
      </ListGroup>
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
