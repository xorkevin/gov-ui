import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useAuthResource} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Chip from 'component/chip';
import Button from 'component/button';
import Time from 'component/time';

const selectAPIAccount = (api) => api.u.user.get;

const AccountDetails = ({match}) => {
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
      <Link to={`${match.path}/edit`}>
        <Button outline>Edit</Button>
      </Link>
      <Link to={`${match.path}/email`}>
        <Button outline>Change Email</Button>
      </Link>
      <Link to={`${match.path}/pass`}>
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
            <ListItem label="userid" item={userid} />
            <ListItem label="username" item={username} />
            <ListItem label="first name" item={first_name} />
            <ListItem label="last name" item={last_name} />
            <ListItem
              label="roles"
              item={
                auth_tags &&
                auth_tags.split(',').map((tag) => <Chip key={tag}>{tag}</Chip>)
              }
            />
            <ListItem label="email" item={email} />
            <ListItem
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
