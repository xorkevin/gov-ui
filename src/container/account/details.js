import React, {Fragment, useCallback} from 'react';
import {useURL} from '@xorkevin/substation';
import {useAuthValue, useAuthCall, useAuthResource} from '@xorkevin/turbine';
import {
  Grid,
  Column,
  Field,
  FieldTextarea,
  FieldFile,
  Form,
  useForm,
  SnackbarSurface,
  useSnackbarView,
  Chip,
  FaIcon,
  ButtonGroup,
  Time,
} from '@xorkevin/nuke';
import Img from '@xorkevin/nuke/src/component/image/rounded';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;
const selectAPICreateProfile = (api) => api.profile.create;
const selectAPIEditProfile = (api) => api.profile.edit;
const selectAPIEditImage = (api) => api.profile.edit.image;

const Profile = () => {
  const snackProfileUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Profile updated</SnackbarSurface>,
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

  const [profile, reexecute] = useAuthResource(
    selectAPIProfile,
    [],
    {
      contact_email: '',
      bio: '',
      image: '',
    },
    {posthook},
  );

  const [edit, execEdit] = useAuthCall(
    selectAPIEditProfile,
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
        {create.err && <p>{create.err}</p>}
      </div>
    );
  }

  return (
    <Fragment>
      <h3>Profile</h3>
      <hr />
      {profile.success && (
        <Grid>
          <Column md={16}>
            <Form
              formState={form.state}
              onChange={form.update}
              onSubmit={execEdit}
            >
              <Field
                name="contact_email"
                label="Contact email"
                nohint
                fullWidth
              />
              <FieldTextarea name="bio" label="Bio" nohint fullWidth />
            </Form>
            <ButtonGroup>
              <ButtonPrimary onClick={execEdit}>Update Profile</ButtonPrimary>
            </ButtonGroup>
            {edit.err && <p>{edit.err}</p>}
          </Column>
          <Column md={8}>
            <h4>Profile picture</h4>
            {profile.data.image && (
              <Img src={imageURL} preview={profile.data.image} ratio={1} />
            )}
            <FieldFile
              name="image"
              label="Edit"
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
            {editImage.err && <p>{editImage.err}</p>}
          </Column>
        </Grid>
      )}
      {profile.err && <p>{profile.err}</p>}
    </Fragment>
  );
};

const selectAPIAccount = (api) => api.u.user.get;
const selectAPIEditAccount = (api) => api.u.user.edit;

const AccountDetails = ({showProfile}) => {
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>&#x2713; Account updated</SnackbarSurface>,
  );

  const form = useForm({
    username: '',
    first_name: '',
    last_name: '',
  });

  const [edit, execEdit] = useAuthCall(
    selectAPIEditAccount,
    [form.state],
    {},
    {posthook: displaySnackbar},
  );

  const formAssign = form.assign;
  const posthook = useCallback(
    (_status, {username, first_name, last_name}) => {
      formAssign({
        username,
        first_name,
        last_name,
      });
    },
    [formAssign],
  );

  const [account] = useAuthResource(
    selectAPIAccount,
    [],
    {
      userid: '',
      username: '',
      auth_tags: '',
      first_name: '',
      last_name: '',
      creation_time: 0,
    },
    {posthook},
  );

  return (
    <div>
      <h3>Account</h3>
      <hr />
      {account.success && (
        <Grid>
          <Column md={16}>
            <Form
              formState={form.state}
              onChange={form.update}
              onSubmit={execEdit}
            >
              <Field name="username" label="Username" nohint fullWidth />
              <Field name="first_name" label="First name" nohint fullWidth />
              <Field name="last_name" label="Last name" nohint fullWidth />
            </Form>
            <ButtonGroup>
              <ButtonPrimary onClick={execEdit}>Update account</ButtonPrimary>
            </ButtonGroup>
            {edit.err && <p>{edit.err}</p>}
          </Column>
          <Column md={8}>
            <h5>Userid</h5>
            <code>{account.data.userid}</code>
            <h5>Roles</h5>
            {account.data.auth_tags &&
              account.data.auth_tags
                .split(',')
                .map((tag) => <Chip key={tag}>{tag}</Chip>)}
            <p>
              Created <Time value={account.data.creation_time * 1000} />
            </p>
          </Column>
        </Grid>
      )}
      {account.err && <p>{account.err}</p>}
      {showProfile && <Profile />}
    </div>
  );
};

export default AccountDetails;
