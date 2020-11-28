import React, {useCallback} from 'react';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  usePaginate,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const ORG_LIMIT = 32;

const selectAPIRoles = (api) => api.u.user.get.roles;
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

const Orgs = ({orgRoleRegex}) => {
  const displaySnackbarCreate = useSnackbarView(
    <SnackbarSurface>&#x2713; Org created</SnackbarSurface>,
  );

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
    [ORG_LIMIT, paginate.index],
    [],
    {posthook: posthookRoles},
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
          {roles.data
            .filter((i) => orgRoleRegex.test(i))
            .map((i) => (
              <div key={i}>{i}</div>
            ))}
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
