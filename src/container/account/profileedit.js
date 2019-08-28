import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from 'service/auth';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input, {useForm} from 'component/form';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIEdit = (api) => api.profile.edit;
const selectAPIEditImage = (api) => api.profile.edit.image;

const ProfileEdit = () => {
  const [formState, updateForm] = useForm({
    contact_email: '',
    bio: '',
  });

  const posthook = useCallback(
    (_status, {contact_email, bio}) => {
      updateForm('contact_email', contact_email);
      updateForm('bio', bio);
    },
    [updateForm],
  );

  const {err: errProfile} = useAuthResource(
    selectAPIProfile,
    [],
    {
      contact_email: '',
      bio: '',
    },
    {posthook},
  );

  const [editState, execEdit] = useAuthCall(selectAPIEdit, [formState]);

  const [imageState, updateImage] = useForm({
    image: undefined,
  });

  const [editImageState, execEditImage] = useAuthCall(selectAPIEditImage, [
    imageState.image,
  ]);

  const {success, err} = editState;
  const {success: successImage, err: errImage} = editImageState;

  const bar = (
    <Fragment>
      <Link to="/a/profile">
        <Button text>{success ? 'Back' : 'Cancel'}</Button>
      </Link>
      <Button primary onClick={execEdit}>
        Save
      </Button>
    </Fragment>
  );

  return (
    <div>
      <Card size="lg" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Profile">
          <Input
            label="contact email"
            name="contact_email"
            value={formState.contact_email}
            onChange={updateForm}
            fullWidth
          />
          <Input
            label="bio"
            name="bio"
            value={formState.bio}
            onChange={updateForm}
            onEnter={execEdit}
            textarea
            fullWidth
          />
          <Input
            type="file"
            accept="image/*"
            capture="environment"
            label="profile image"
            name="image"
            onChange={updateImage}
            fullWidth
          />
          <Button outline onClick={execEditImage}>
            Upload
          </Button>
          {errImage && <span>{errImage}</span>}
          {successImage && <span>Image updated</span>}
        </Section>
        {errProfile && <span>{errProfile}</span>}
        {err && <span>{err}</span>}
        {success && <span>Changes saved</span>}
      </Card>
    </div>
  );
};

export default ProfileEdit;
