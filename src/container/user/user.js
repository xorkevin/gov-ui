import React, {useState, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useURL, useResource, selectAPINull} from '@xorkevin/substation';
import {Grid, Column, Section, Card, Time} from '@xorkevin/nuke';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIProfile = (api) => api.profile.id;
const selectAPIImage = (api) => api.profile.id.image;

const UserDetails = () => {
  const {username} = useParams();
  const [userid, setUserid] = useState('');

  const posthook = useCallback(
    (_status, data) => {
      setUserid(data.userid);
    },
    [setUserid],
  );
  const {success: successAccount, err: errAccount, data: account} = useResource(
    username && username.length > 0 ? selectAPIUser : selectAPINull,
    [username],
    {first_name: '', last_name: '', username: '', creation_time: ''},
    {posthook},
  );
  const imageURL = useURL(selectAPIImage, [userid]);

  const {err: errProfile, data: profile} = useResource(
    userid.length > 0 ? selectAPIProfile : selectAPINull,
    [userid],
    {bio: '', image: ''},
  );

  return (
    <Section container padded>
      <Grid>
        <Column sm={8} md={6}>
          {successAccount && (
            <Card
              title=""
              imgHeight={384}
              imgWidth={384}
              background={imageURL}
              preview={profile.image}
            >
              <h4>
                {account.first_name} {account.last_name}{' '}
                <small>@{account.username}</small>
              </h4>
              <h6>
                joined <Time value={account.creation_time * 1000} />
              </h6>
              {profile.bio && <p>{profile.bio}</p>}
            </Card>
          )}
          {(errAccount || errProfile) && (
            <span>{errAccount || errProfile}</span>
          )}
        </Column>
        <Column sm={16} md={18} />
      </Grid>
    </Section>
  );
};

export default UserDetails;
