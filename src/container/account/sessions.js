import React, {Fragment, useMemo} from 'react';
import {useAuthCall, useAuthResource} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Time from 'component/time';
import Input, {useForm} from 'component/form';

const selectAPISessions = (api) => api.u.user.sessions;
const selectAPISessionDelete = (api) => api.u.user.sessions.del;

const AccountSessions = () => {
  const [formState, updateForm] = useForm();

  const sessions = Object.keys(formState).sort();
  const session_ids = useMemo(() => {
    return sessions;
  }, [sessions.join(',')]);

  const {success, err, data} = useAuthResource(selectAPISessions);

  const [deleteState, execDelete] = useAuthCall(selectAPISessionDelete, [
    session_ids,
  ]);

  const {success: successDelete, err: errDelete} = deleteState;

  const bar = (
    <Fragment>
      <Button primary onClick={execDelete}>
        Delete
      </Button>
    </Fragment>
  );

  return (
    <Card size="lg" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Active Sessions">
        {success &&
          data.map((session) => {
            return (
              <div key={session.session_id}>
                <Input
                  type="checkbox"
                  label={
                    <span>
                      {session.ip} | last accessed{' '}
                      <Time value={session.time * 1000} />
                    </span>
                  }
                  name={session.session_id}
                  checked={formState[session.session_id] || false}
                  onChange={updateForm}
                  fullWidth
                />
                <span>{session.user_agent}</span>
              </div>
            );
          })}
      </Section>
      {err && <span>{err}</span>}
      {errDelete && <span>{errDelete}</span>}
      {successDelete && <span>Sessions deleted</span>}
    </Card>
  );
};

export default AccountSessions;
