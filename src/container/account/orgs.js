import React, {useState, useCallback, useMemo} from 'react';
import {selectAPINull} from '@xorkevin/substation';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  ListGroup,
  ListItem,
  Tabbar,
  TabItem,
  useMenu,
  Menu,
  MenuItem,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
  FaIcon,
  Chip,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';
import AnchorText from '@xorkevin/nuke/src/component/anchor/text';
import {formatStr} from '../../utility';

const ORG_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.get.roles;
const selectAPIOrgs = (api) => api.orgs.get;
const selectAPICreate = (api) => api.orgs.create;

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
    return 'A display name must be provided';
  }
};

const OrgRow = ({isMod, pathOrg, pathOrgSettings, name}) => {
  const menu = useMenu();
  return (
    <ListItem>
      <Grid justify="space-between" align="center" nowrap>
        <Column className="account-org-item-name">
          <h5 className="account-org-item-heading">
            <AnchorText local href={formatStr(pathOrg, name)}>
              {name}
            </AnchorText>
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
              <MenuItem local link={`/org/${name}`}>
                View
              </MenuItem>
              {isMod && (
                <MenuItem local link={formatStr(pathOrgSettings, name)}>
                  Settings
                </MenuItem>
              )}
            </Menu>
          )}
        </Column>
      </Grid>
    </ListItem>
  );
};

const Orgs = ({orgUsrPrefix, orgModPrefix, pathOrg, pathOrgSettings}) => {
  const displaySnackbarCreate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org created</SnackbarSurface>,
  );

  const [isViewMod, setViewMod] = useState(false);
  const viewUsr = useCallback(() => {
    setViewMod(false);
  }, [setViewMod]);
  const viewMod = useCallback(() => {
    setViewMod(true);
  }, [setViewMod]);

  const form = useForm({
    display_name: '',
    desc: '',
  });

  const paginate = usePaginate(ORG_LIMIT);

  const setAtEnd = paginate.setAtEnd;
  const posthookRoles = useCallback(
    (_status, roles) => {
      setAtEnd(roles.length < ORG_LIMIT);
    },
    [setAtEnd],
  );
  const [roles, reexecute] = useAuthResource(
    selectAPIRoles,
    [isViewMod ? orgModPrefix : orgUsrPrefix, ORG_LIMIT, paginate.index],
    [],
    {posthook: posthookRoles},
  );

  const prefixLen = isViewMod ? orgModPrefix.length : orgUsrPrefix.length;
  const orgids = useMemo(() => roles.data.map((i) => i.slice(prefixLen)), [
    prefixLen,
    roles,
  ]);
  const [orgs, _reexecute] = useAuthResource(
    orgids.length > 0 ? selectAPIOrgs : selectAPINull,
    [orgids],
    [],
  );

  const formAssign = form.assign;
  const posthookCreate = useCallback(
    (_status, _data, opts) => {
      formAssign({
        display_name: '',
        desc: '',
      });
      reexecute(opts);
      displaySnackbarCreate();
    },
    [displaySnackbarCreate, reexecute, formAssign],
  );
  const [create, execCreate] = useAuthCall(
    selectAPICreate,
    [form.state],
    {},
    {prehook: prehookValidate, posthook: posthookCreate},
  );

  return (
    <div>
      <h3>Organizations</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
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
              orgs.data.map((i) => (
                <OrgRow
                  key={i.orgid}
                  isMod={isViewMod}
                  pathOrg={pathOrg}
                  pathOrgSettings={pathOrgSettings}
                  orgid={i.orgid}
                  name={i.name}
                  display_name={i.display_name}
                  desc={i.desc}
                  creation_time={i.creation_time}
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
          {roles.err && <p>{roles.err}</p>}
          {orgs.err && <p>{orgs.err}</p>}
        </Column>
        <Column fullWidth md={8}>
          <h4>Create new org</h4>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execCreate}
            validCheck={formValidCheck}
          >
            <Field name="display_name" label="Display name" nohint />
            <Field name="desc" label="Description" nohint />
          </Form>
          <ButtonGroup>
            <ButtonPrimary onClick={execCreate}>Create Org</ButtonPrimary>
          </ButtonGroup>
          {create.err && <p>{create.err}</p>}
        </Column>
      </Grid>
    </div>
  );
};

export default Orgs;
