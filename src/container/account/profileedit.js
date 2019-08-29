import React, {Fragment, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from 'service/auth';
import {useSnackbarView} from 'service/snackbar';
import Grid from 'component/grid';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import {Form, Input, useForm} from 'component/form';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIEdit = (api) => api.profile.edit;
const selectAPIEditImage = (api) => api.profile.edit.image;

const ProfileEdit = () => {
  const snackImageUpdate = useSnackbarView(
    <Fragment>
      <span>Image updated</span>
    </Fragment>,
  );

  const snackProfileUpdate = useSnackbarView(
    <Fragment>
      <span>Changes saved</span>
    </Fragment>,
  );

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

  const [editState, execEdit] = useAuthCall(
    selectAPIEdit,
    [formState],
    {},
    {posthook: snackProfileUpdate},
  );

  const [imageState, updateImage] = useForm({
    image: undefined,
  });

  const [editImageState, execEditImage] = useAuthCall(
    selectAPIEditImage,
    [imageState.image],
    {},
    {posthook: snackImageUpdate},
  );

  const {success, err} = editState;
  const {success: successImage, err: errImage} = editImageState;

  const bar = (
    <Fragment>
      <Link to="/a/profile">
        <Button text>{success || successImage ? 'Back' : 'Cancel'}</Button>
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
          <Form formState={formState} onChange={updateForm} onEnter={execEdit}>
            <Input label="contact email" name="contact_email" fullWidth />
            <Input label="bio" name="bio" textarea fullWidth />
          </Form>
          <Grid verticalCenter>
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              label="profile image"
              name="image"
              onChange={updateImage}
            />
            <Button outline onClick={execEditImage}>
              Upload
            </Button>
          </Grid>
          {errImage && <span>{errImage}</span>}
        </Section>
        {errProfile && <span>{errProfile}</span>}
        {err && <span>{err}</span>}
      </Card>
    </div>
  );
};

export default ProfileEdit;
