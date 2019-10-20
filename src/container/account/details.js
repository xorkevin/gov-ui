import React, {Fragment} from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useAuthResource} from '@xorkevin/turbine';
import {Section, Card, Description, Chip, Button, Time} from '@xorkevin/nuke';

const selectAPIAccount = (api) => api.u.user.get;

const AccountDetails = () => {
  const match = useRouteMatch();

  const {success, err, data} = useAuthResource(selectAPIAccount, [], {
    userid: '',
    username: '',
    auth_tags: '',
    first_name: '',
    last_name: '',
    creation_time: 0,
    email: '',
  });

  const {
    userid,
    username,
    first_name,
    last_name,
    auth_tags,
    email,
    creation_time,
  } = data;

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
      {err && <span>{err}</span>}
      {success && (
        <Card size="lg" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Account Details">
            <Description label="userid" item={userid} />
            <Description label="username" item={username} />
            <Description label="first name" item={first_name} />
            <Description label="last name" item={last_name} />
            <Description
              label="roles"
              item={
                auth_tags &&
                auth_tags.split(',').map((tag) => <Chip key={tag}>{tag}</Chip>)
              }
            />
            <Description label="email" item={email} />
            <Description
              label="creation time"
              item={<Time value={creation_time * 1000} />}
            />
          </Section>
        </Card>
      )}
    </div>
  );
};

export default AccountDetails;
