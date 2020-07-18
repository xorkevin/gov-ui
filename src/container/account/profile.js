import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useURL} from '@xorkevin/substation';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {Section, Card, Description, Button, Img} from '@xorkevin/nuke';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;
const selectAPICreateProfile = (api) => api.profile.create;

const Profile = () => {
  const [profile] = useAuthResource(selectAPIProfile, [], {
    contact_email: '',
    bio: '',
    image: '',
  });

  const canCreate = profile.status === 404;

  const [create, execCreate] = useAuthCall(selectAPICreateProfile);

  const {userid} = useAuthValue();
  const imageURL = useURL(selectAPIProfileImage, [userid]);

  const bar = (
    <Fragment>
      <Link to="/a/profile/edit">
        <Button outline>Edit</Button>
      </Link>
    </Fragment>
  );

  return (
    <div>
      {canCreate && (
        <div>
          <Button primary onClick={execCreate}>
            Create Profile
          </Button>
        </div>
      )}
      {create.success && <span>Profile created</span>}
      {create.err && <span>{create.err}</span>}
      {profile.success && (
        <Card size="lg" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Profile">
            <Description
              label="contact email"
              item={profile.data.contact_email}
            />
            <Description label="bio" item={profile.data.bio} />
            <Description
              label="profile image"
              item={
                profile.data.image && (
                  <Img
                    rounded
                    preview={profile.data.image}
                    imgWidth={384}
                    imgHeight={384}
                    src={imageURL}
                  />
                )
              }
            />
          </Section>
        </Card>
      )}
      {!canCreate && profile.err && <span>{profile.err}</span>}
    </div>
  );
};

export default Profile;
