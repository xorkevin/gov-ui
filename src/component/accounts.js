import {useEffect, useCallback, useMemo, useContext} from 'react';
import {useAPI} from '@xorkevin/substation';
import {useAuthValue, useRelogin, useAuthResource} from '@xorkevin/turbine';
import {
  FieldDynSearchSelect,
  Form,
  useForm,
  useFormSearch,
} from '@xorkevin/nuke';

import {GovUICtx} from '../middleware';

const selectAPIOrgs = (api) => api.orgs.search;

const ORG_LIMIT = 32;

const useAccountChooser = () => {
  const ctx = useContext(GovUICtx);
  const {userid, username} = useAuthValue();

  const form = useForm({
    accountid: userid,
  });

  const {putDisplays} = form;
  useEffect(() => {
    putDisplays('accountid', {[userid]: `${username} (Personal)`});
  }, [putDisplays, userid, username]);

  const {orgName} = ctx;
  const relogin = useRelogin();
  const apiSearch = useAPI(selectAPIOrgs);
  const searchOrgs = useCallback(
    async ({signal}, search) => {
      const [_data, _res, errLogin] = await relogin();
      if (errLogin) {
        return [];
      }
      const [data, res, err] = await apiSearch({signal}, search, ORG_LIMIT, 0);
      if (err || !res || !res.ok || !Array.isArray(data)) {
        return [];
      }
      return data.map((i) => ({
        display: i.name,
        value: orgName(i.orgid),
      }));
    },
    [apiSearch, relogin, orgName],
  );
  const orgSuggest = useFormSearch(searchOrgs, 256);

  const [orgs] = useAuthResource(selectAPIOrgs, ['', ORG_LIMIT, 0], []);
  const baseOpts = useMemo(
    () =>
      [{display: `${username} (Personal)`, value: userid}].concat(
        orgs.data.map((i) => ({display: i.name, value: orgName(i.orgid)})),
      ),
    [orgName, userid, username, orgs],
  );
  return {
    accountid: form.state.accountid,
    form,
    suggest: orgSuggest,
    baseOpts,
  };
};

const AccountForm = ({accounts}) => {
  const {form, suggest, baseOpts} = accounts;
  return (
    <Form
      formState={form.state}
      onChange={form.update}
      displays={form.displays}
      putDisplays={form.putDisplays}
      addDisplay={form.addDisplay}
      compactDisplays={form.compactDisplays}
    >
      <FieldDynSearchSelect
        name="accountid"
        placeholder="Search"
        onSearch={suggest.setSearch}
        options={suggest.opts.length === 0 ? baseOpts : suggest.opts}
        nohint
        fullWidth
      />
    </Form>
  );
};

export {useAccountChooser, AccountForm};
