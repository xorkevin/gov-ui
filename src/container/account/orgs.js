import {Fragment, useState, useCallback, useMemo, useContext} from 'react';
import {useResource, selectAPINull} from '@xorkevin/substation';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  Tabbar,
  TabItem,
  ModalSurface,
  useModal,
  useMenu,
  Menu,
  MenuItem,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbar,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';

import {GovUICtx} from '../../middleware';
import {formatURL} from '../../utility';

const ORG_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.roles.get;
const selectAPIOrgs = (api) => api.orgs.get;
const selectAPICreate = (api) => api.orgs.create;
const selectAPIEditRank = (api) => api.u.user.id.edit.rank;

const formValidCheck = ({display_name}) => {
  const valid = {};
  if (display_name.length > 0) {
    valid.display_name = true;
  }
  return valid;
};

const prehookValidate = ([form]) => {
  const {display_name} = form;
  if (display_name.length === 0) {
    return {message: 'A display name must be provided'};
  }
};

const OrgRow = ({
  isMod,
  pathOrg,
  pathOrgSettings,
  orgid,
  name,
  display_name,
  posthookLeave,
}) => {
  const {userid: auth_userid} = useAuthValue();
  const ctx = useContext(GovUICtx);

  const snackbar = useSnackbar();
  const displayErrSnack = useCallback(
    (_deleteState, err) => {
      snackbar(<SnackbarSurface>{err.message}</SnackbarSurface>);
    },
    [snackbar],
  );

  const usrRole = ctx.orgUsrRole(orgid);

  const memberRole = useMemo(
    () => ({
      add: [],
      remove: [usrRole],
    }),
    [usrRole],
  );

  const [_leaveOrg, execLeaveOrg] = useAuthCall(
    selectAPIEditRank,
    [auth_userid, memberRole.add, memberRole.remove],
    {},
    {posthook: posthookLeave, errhook: displayErrSnack},
  );

  const menu = useMenu();

  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="account-org-item-name">
          <h5 className="account-org-item-heading">
            <AnchorText local href={formatURL(pathOrg, name)}>
              {display_name}
            </AnchorText>{' '}
            <small>{name}</small>
          </h5>
          <small>
            <Chip>{isMod ? 'Moderator' : 'Member'}</Chip>
          </small>
        </Column>
        <Column shrink="0">
          <ButtonTertiary forwardedRef={menu.anchorRef} onClick={menu.toggle}>
            <FaIcon icon="ellipsis-v" />
          </ButtonTertiary>
          {menu.show && (
            <Menu size="md" anchor={menu.anchor} close={menu.close}>
              <MenuItem local link={formatURL(pathOrg, name)}>
                View
              </MenuItem>
              {isMod && (
                <MenuItem local link={formatURL(pathOrgSettings, name)}>
                  Settings
                </MenuItem>
              )}
              {!isMod && <MenuItem onClick={execLeaveOrg}>Leave</MenuItem>}
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const CreateOrg = ({posthookCreate, close}) => {
  const form = useForm({
    display_name: '',
    desc: '',
  });

  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [form.state],
    {},
    {prehook: prehookValidate, posthook: posthookCreate},
  );

  return (
    <Fragment>
      <h4>Create new org</h4>
      <Form
        formState={form.state}
        onChange={form.update}
        onSubmit={execCreate}
        validCheck={formValidCheck}
      >
        <Field name="display_name" label="Display name" nohint fullWidth />
        <Field name="desc" label="Description" nohint fullWidth />
      </Form>
      <ButtonGroup>
        <ButtonTertiary onClick={close}>Close</ButtonTertiary>
        <ButtonPrimary onClick={execCreate}>Create Org</ButtonPrimary>
      </ButtonGroup>
      {create.err && <p>{create.err.message}</p>}
    </Fragment>
  );
};

const Orgs = () => {
  const ctx = useContext(GovUICtx);
  const displaySnackbarCreate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org created</SnackbarSurface>,
  );
  const snackLeftOrg = useSnackbarView(
    <SnackbarSurface>&#x2713; Left organization</SnackbarSurface>,
  );

  const [isViewMod, setViewMod] = useState(false);

  const paginate = usePaginate(ORG_LIMIT);

  const setFirst = paginate.first;
  const viewUsr = useCallback(() => {
    setViewMod(false);
    setFirst();
  }, [setViewMod, setFirst]);
  const viewMod = useCallback(() => {
    setViewMod(true);
    setFirst();
  }, [setViewMod, setFirst]);

  const setAtEnd = paginate.setAtEnd;
  const posthookRoles = useCallback(
    (_status, roles) => {
      setAtEnd(roles.length < ORG_LIMIT);
    },
    [setAtEnd],
  );
  const [roles, reexecute] = useAuthResource(
    selectAPIRoles,
    [
      isViewMod ? ctx.orgModPrefix : ctx.orgUsrPrefix,
      ORG_LIMIT,
      paginate.index,
    ],
    [],
    {posthook: posthookRoles},
  );

  const roleToOrgID = ctx.roleToOrgID;
  const orgids = useMemo(
    () => roles.data.map((i) => roleToOrgID(i)),
    [roleToOrgID, roles],
  );
  const [orgs] = useResource(
    orgids.length > 0 ? selectAPIOrgs : selectAPINull,
    [orgids],
    [],
  );

  const modal = useModal();

  const modalClose = modal.close;
  const posthookCreate = useCallback(() => {
    modalClose();
    displaySnackbarCreate();
    reexecute();
  }, [modalClose, displaySnackbarCreate, reexecute]);

  const posthookLeave = useCallback(() => {
    snackLeftOrg();
    reexecute();
  }, [reexecute, snackLeftOrg]);

  return (
    <div>
      <Grid justify="space-between" align="flex-end">
        <Column grow="1">
          <h3>Organizations</h3>
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
            <ModalSurface size="md" anchor={modal.anchor} close={modalClose}>
              <CreateOrg posthookCreate={posthookCreate} close={modalClose} />
            </ModalSurface>
          )}
        </Column>
      </Grid>
      <hr />
      <Tabbar>
        <TabItem className={!isViewMod ? 'active' : ''} onClick={viewUsr}>
          Member
        </TabItem>
        <TabItem className={isViewMod ? 'active' : ''} onClick={viewMod}>
          Moderator
        </TabItem>
      </Tabbar>
      <ListGroup>
        {orgids.length > 0 &&
          Array.isArray(orgs.data) &&
          orgs.data.map((i) => (
            <OrgRow
              key={i.orgid}
              isMod={isViewMod}
              pathOrg={ctx.pathOrg}
              pathOrgSettings={ctx.pathOrgSettings}
              orgid={i.orgid}
              name={i.name}
              display_name={i.display_name}
              desc={i.desc}
              creation_time={i.creation_time}
              posthookLeave={posthookLeave}
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
      {roles.err && <p>{roles.err.message}</p>}
      {orgs.err && <p>{orgs.err.message}</p>}
    </div>
  );
};

export default Orgs;
