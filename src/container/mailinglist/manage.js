import {useAuthValue} from '@xorkevin/turbine';
import {FieldSearchSelect, Form, useForm} from '@xorkevin/nuke';

import {useOrgOpts} from '../../component/accounts';

const Manage = () => {
  const {userid} = useAuthValue();

  const form = useForm({
    accountid: userid,
  });
  const orgOpts = useOrgOpts();

  return (
    <div>
      <h3>Manage Lists</h3>
      <hr />
      <Form formState={form.state} onChange={form.update}>
        <FieldSearchSelect
          name="accountid"
          options={orgOpts}
          label="Account"
          nohint
        />
      </Form>
      {form.state.accountid}
    </div>
  );
};

export default Manage;
