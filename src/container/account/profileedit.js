import React, {useCallback} from 'react';
import {Link} from 'react-router-dom';
import {useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Container,
  Card,
  Field,
  FieldTextarea,
  FieldFile,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  FaIcon,
  ButtonGroup,
} from '@xorkevin/nuke';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIEdit = (api) => api.profile.edit;
const selectAPIEditImage = (api) => api.profile.edit.image;

const ProfileEdit = ({pathProfile}) => {
  const snackProfileUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Changes saved</SnackbarSurface>,
  );

  const snackImageUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Image updated</SnackbarSurface>,
  );

  const form = useForm({
    contact_email: '',
    bio: '',
  });

  const formAssign = form.assign;

  const posthook = useCallback(
    (_status, {contact_email, bio}) => {
      formAssign({
        contact_email,
        bio,
      });
    },
    [formAssign],
  );

  const [profile] = useAuthResource(
    selectAPIProfile,
    [],
    {
      contact_email: '',
      bio: '',
    },
    {posthook},
  );

  const [edit, execEdit] = useAuthCall(
    selectAPIEdit,
    [form.state],
    {},
    {posthook: snackProfileUpdate},
  );

  const imageform = useForm({
    image: undefined,
  });

  const [editImage, execEditImage] = useAuthCall(
    selectAPIEditImage,
    [imageform.state.image],
    {},
    {posthook: snackImageUpdate},
  );

  return (
    <div>
      {profile.success && (
        <Card
          center
          width="lg"
          title={
            <Container padded>
              <h3>Update Profile</h3>
            </Container>
          }
          bar={
            <ButtonGroup>
              <Link to={pathProfile}>
                <ButtonTertiary>
                  {edit.success || editImage.success ? 'Back' : 'Cancel'}
                </ButtonTertiary>
              </Link>
              <ButtonPrimary onClick={execEdit}>Save</ButtonPrimary>
            </ButtonGroup>
          }
        >
          <Container padded>
            <Form
              formState={form.state}
              onChange={form.update}
              onSubmit={execEdit}
            >
              <Field name="contact_email" label="contact email" fullWidth />
              <FieldTextarea name="bio" label="bio" fullWidth />
            </Form>
            <FieldFile
              name="image"
              label="profile image"
              hint="Choose an image"
              accept="image/jpeg, image/png"
              onChange={imageform.update}
              fullWidth
            >
              <ButtonTertiary>Select</ButtonTertiary>
            </FieldFile>
            <ButtonSecondary onClick={execEditImage}>
              <FaIcon icon="cloud-upload" /> Upload
            </ButtonSecondary>
            {edit.err && <span>{edit.err}</span>}
            {editImage.err && <span>{editImage.err}</span>}
          </Container>
        </Card>
      )}
      {profile.err && <span>{profile.err}</span>}
    </div>
  );
};

export default ProfileEdit;
