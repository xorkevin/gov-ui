import React, {Fragment} from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useAuthResource} from '@xorkevin/turbine';
import {Section, Card, Description, Chip, Button, Time} from '@xorkevin/nuke';

const selectAPIAccount = (api) => api.u.user.get;

const AccountDetails = () => {
  const match = useRouteMatch();

  const [account] = useAuthResource(selectAPIAccount, [], {
    userid: '',
    username: '',
    auth_tags: '',
    first_name: '',
    last_name: '',
    creation_time: 0,
    email: '',
  });

  const bar = (
    <Fragment>
      <Link to={`${match.url}/edit`}>
        <Button outline>Edit</Button>
      </Link>
      <Link to={`${match.url}/email`}>
        <Button outline>Change Email</Button>
      </Link>
      <Link to={`${match.url}/pass`}>
        <Button outline>Change Password</Button>
      </Link>
    </Fragment>
  );

  return (
    <div>
      {account.err && <span>{account.err}</span>}
      {account.success && (
        <Card size="lg" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Account Details">
            <Description label="userid" item={account.data.userid} />
            <Description label="username" item={account.data.username} />
            <Description label="first name" item={account.data.first_name} />
            <Description label="last name" item={account.data.last_name} />
            <Description
              label="roles"
              item={
                account.data.auth_tags &&
                account.data.auth_tags
                  .split(',')
                  .map((tag) => <Chip key={tag}>{tag}</Chip>)
              }
            />
            <Description label="email" item={account.data.email} />
            <Description
              label="creation time"
              item={<Time value={account.data.creation_time * 1000} />}
            />
          </Section>
        </Card>
      )}
    </div>
  );
};

export default AccountDetails;
