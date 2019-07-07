import React, {useState, useCallback} from 'react';
import {useURL, useResource, selectAPINull} from 'apiclient';
import {Grid, Column} from 'component/grid';
import Section from 'component/section';
import Card from 'component/card';
import Time from 'component/time';

const selectAPIUser = (api) => api.u.user.name;
const selectAPIProfile = (api) => api.profile.id;
const selectAPIImage = (api) => api.profile.id.image;

const UserDetails = ({match}) => {
  const [userid, setUserid] = useState('');

  const posthook = useCallback(
    (data) => {
      setUserid(data.userid);
    },
    [setUserid],
  );
  const {success: successAccount, err: errAccount, data: account} = useResource(
    selectAPIUser,
    [match.params.username || ''],
    {first_name: '', last_name: '', username: '', creation_time: ''},
    null,
    posthook,
  );
  const imageURL = useURL(selectAPIImage, [userid]);

  const {success: successProfile, err: errProfile, data: profile} = useResource(
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
