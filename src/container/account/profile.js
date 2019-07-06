import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {useURL} from 'apiclient';
import {useAuthState, useAuthCall, useAuthResource} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Button from 'component/button';
import Img from 'component/image';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;
const selectAPICreateProfile = (api) => api.profile.create;

const Profile = () => {
  const {loading, success, err, status, data} = useAuthResource(
    selectAPIProfile,
    [],
    {
      contact_email: '',
      bio: '',
      image: '',
    },
  );

  const canCreate = status === 404;

  const [createState, execCreate] = useAuthCall(selectAPICreateProfile);
  const {success: successCreate, err: errCreate} = createState;

  const {userid} = useAuthState();
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
      {successCreate && <span>Profile created</span>}
      {errCreate && <span>{errCreate}</span>}
      {success && (
        <Card size="lg" restrictWidth center bar={bar}>
          <Section subsection sectionTitle="Profile">
            <ListItem label="contact email" item={data.contact_email} />
            <ListItem label="bio" item={data.bio} />
            <ListItem
              label="profile image"
              item={
                data.image && (
                  <Img
                    rounded
                    preview={data.image}
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
      {!canCreate && err && <span>{err}</span>}
    </div>
  );
};

export default Profile;
