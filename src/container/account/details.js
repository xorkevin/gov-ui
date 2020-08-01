import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useAuthResource} from '@xorkevin/turbine';
import {
  Container,
  Card,
  Description,
  Chip,
  ButtonGroup,
  Time,
} from '@xorkevin/nuke';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';

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

  return (
    <div>
      {account.err && <span>{account.err}</span>}
      {account.success && (
        <Card
          center
          width="lg"
          title={
            <Container padded>
              <h3>Account Details</h3>
            </Container>
          }
          bar={
            <ButtonGroup>
              <Link to={`${match.url}/edit`}>
                <ButtonSecondary>Edit</ButtonSecondary>
              </Link>
              <Link to={`${match.url}/email`}>
                <ButtonSecondary>Change Email</ButtonSecondary>
              </Link>
              <Link to={`${match.url}/pass`}>
                <ButtonSecondary>Change Password</ButtonSecondary>
              </Link>
            </ButtonGroup>
          }
        >
          <Container padded>
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
          </Container>
        </Card>
      )}
    </div>
  );
};

export default AccountDetails;
