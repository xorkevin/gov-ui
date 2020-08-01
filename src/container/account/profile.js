import React from 'react';
import {Link} from 'react-router-dom';
import {useURL} from '@xorkevin/substation';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {Container, Card, Description, ButtonGroup} from '@xorkevin/nuke';
import Img from '@xorkevin/nuke/src/component/image/rounded';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;
const selectAPICreateProfile = (api) => api.profile.create;

const Profile = ({pathEdit}) => {
  const [profile, reexecute] = useAuthResource(selectAPIProfile, [], {
    contact_email: '',
    bio: '',
    image: '',
  });

  const [create, execCreate] = useAuthCall(
    selectAPICreateProfile,
    [],
    {},
    {posthook: reexecute},
  );

  const canCreate = profile.status === 404;

  const {userid} = useAuthValue();
  const imageURL = useURL(selectAPIProfileImage, [userid]);

  if (canCreate) {
    return (
      <div>
        <ButtonPrimary onClick={execCreate}>Create Profile</ButtonPrimary>
        {create.err && <span>{create.err}</span>}
      </div>
    );
  }

  return (
    <div>
      {profile.success && (
        <Card
          center
          width="lg"
          title={
            <Container padded>
              <h3>Profile</h3>
            </Container>
          }
          bar={
            <ButtonGroup>
              <Link to={pathEdit}>
                <ButtonSecondary>Edit</ButtonSecondary>
              </Link>
            </ButtonGroup>
          }
        >
          <Container padded>
            <Description
              label="contact email"
              item={profile.data.contact_email}
            />
            <Description label="bio" item={profile.data.bio} />
            <Description
              label="profile image"
              item={
                profile.data.image && (
                  <Img src={imageURL} preview={profile.data.image} ratio={1} />
                )
              }
            />
          </Container>
        </Card>
      )}
      {profile.err && <span>{profile.err}</span>}
    </div>
  );
};

export default Profile;
