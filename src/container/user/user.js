import React from 'react';
import {useParams} from 'react-router-dom';
import {useURL, useResource, selectAPINull} from '@xorkevin/substation';
import {Grid, Column, Section, Card, Time} from '@xorkevin/nuke';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIProfile = (api) => api.profile.id;
const selectAPIImage = (api) => api.profile.id.image;

const UserDetails = () => {
  const {username} = useParams();

  const [account] = useResource(
    username && username.length > 0 ? selectAPIUser : selectAPINull,
    [username],
    {
      userid: '',
      first_name: '',
      last_name: '',
      username: '',
      creation_time: '',
    },
  );
  const imageURL = useURL(selectAPIImage, [account.data.userid]);

  const [profile] = useResource(
    account.data.userid.length > 0 ? selectAPIProfile : selectAPINull,
    [account.data.userid],
    {bio: '', image: ''},
  );

  return (
    <Section container padded>
      <Grid>
        <Column sm={8} md={6}>
          {account.success && (
            <Card
              title=""
              imgHeight={384}
              imgWidth={384}
              background={imageURL}
              preview={profile.data.image}
            >
              <h4>
                {account.data.first_name} {account.data.last_name}{' '}
                <small>@{account.data.username}</small>
              </h4>
              <h6>
                joined <Time value={account.data.creation_time * 1000} />
              </h6>
              {profile.data.bio && <p>{profile.data.bio}</p>}
            </Card>
          )}
          {(account.err || profile.err) && (
            <span>{account.err || profile.err}</span>
          )}
        </Column>
        <Column sm={16} md={18} />
      </Grid>
    </Section>
  );
};

export default UserDetails;
