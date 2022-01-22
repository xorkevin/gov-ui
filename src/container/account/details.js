import {Fragment, useState, useCallback, useContext} from 'react';
import {useURL} from '@xorkevin/substation';
import {
  useAuthValue,
  useAuthCall,
  useAuthResource,
  useRefreshUser,
} from '@xorkevin/turbine';
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
  ButtonGroup,
  Chip,
  FaIcon,
  Time,
} from '@xorkevin/nuke';
import Img from '@xorkevin/nuke/src/component/image/rounded';
import ButtonPrimary from '@xorkevin/nuke/src/component/button/primary';
import ButtonSecondary from '@xorkevin/nuke/src/component/button/secondary';
import ButtonTertiary from '@xorkevin/nuke/src/component/button/tertiary';

import {GovUICtx} from '../../middleware';

const selectAPIProfile = (api) => api.profile.get;
const selectAPIProfileImage = (api) => api.profile.id.image;
const selectAPICreateProfile = (api) => api.profile.create;
const selectAPIEditProfile = (api) => api.profile.edit;
const selectAPIEditImage = (api) => api.profile.edit.image;

const useFormLock = () => {
  const [locked, setLocked] = useState(true);
  const lock = useCallback(() => {
    setLocked(true);
  }, [setLocked]);
  const unlock = useCallback(() => {
    setLocked(false);
  }, [setLocked]);
  return [locked, lock, unlock];
};

const Profile = () => {
  const snackProfileUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Profile updated</SnackbarSurface>,
  );

  const snackImageUpdate = useSnackbarView(
    <SnackbarSurface>&#x2713; Image updated</SnackbarSurface>,
  );

  const [locked, lock, unlock] = useFormLock();

  const form = useForm({
    contact_email: '',
    bio: '',
  });

  const formAssign = form.assign;
  const posthook = useCallback(
    (_res, {contact_email, bio}) => {
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

  const posthookEdit = useCallback(() => {
    lock();
    snackProfileUpdate();
  }, [snackProfileUpdate, lock]);
  const [edit, execEdit] = useAuthCall(
    selectAPIEditProfile,
    [form.state],
    {},
    {posthook: posthookEdit},
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

  const posthookCreate = useCallback(() => {
    reexecute();
  }, [reexecute]);
  const [create, execCreate] = useAuthCall(
    selectAPICreateProfile,
    [],
    {},
    {posthook: posthookCreate},
  );

  const canCreate = profile.res && profile.res.status === 404;

  const {userid} = useAuthValue();
  const imageURL = useURL(selectAPIProfileImage, [userid]);

  if (canCreate) {
    return (
      <div>
        <ButtonPrimary onClick={execCreate}>Create Profile</ButtonPrimary>
        {create.err && <p>{create.err.message}</p>}
      </div>
    );
  }

  return (
    <Fragment>
      <h3>Profile</h3>
      <hr />
      {profile.success && (
        <Grid>
          <Column fullWidth md={16}>
            <Form
              formState={form.state}
              onChange={form.update}
              onSubmit={execEdit}
            >
              <Field
                className="field-disabled-solid"
                name="contact_email"
                label="Contact email"
                nohint
                disabled={locked}
                fullWidth
                autoComplete="email"
              />
              <FieldTextarea
                className="field-disabled-solid"
                name="bio"
                label="Bio"
                nohint
                disabled={locked}
                fullWidth
              />
            </Form>
            <ButtonGroup>
              {locked ? (
                <Fragment>
                  <FaIcon icon="lock" />
                  <ButtonTertiary onClick={unlock}>Edit</ButtonTertiary>
                </Fragment>
              ) : (
                <Fragment>
                  <FaIcon icon="unlock-alt" />
                  <ButtonTertiary onClick={lock}>Cancel</ButtonTertiary>
                  <ButtonPrimary onClick={execEdit}>
                    Update Profile
                  </ButtonPrimary>
                </Fragment>
              )}
            </ButtonGroup>
            {edit.err && <p>{edit.err.message}</p>}
          </Column>
          <Column fullWidth md={8}>
            <h4>Profile picture</h4>
            {profile.data.image && (
              <Img src={imageURL} preview={profile.data.image} ratio="1 / 1" />
            )}
            <FieldFile
              name="image"
              hint="Choose an image"
              accept="image/jpeg, image/png"
              onChange={imageform.update}
              fullWidth
            >
              <ButtonTertiary>Edit</ButtonTertiary>
            </FieldFile>
            <ButtonSecondary
              onClick={execEditImage}
              disabled={!imageform.state.image}
            >
              <FaIcon icon="cloud-upload" /> Upload
            </ButtonSecondary>
            {editImage.err && <p>{editImage.err.message}</p>}
          </Column>
        </Grid>
      )}
      {profile.err && <p>{profile.err.message}</p>}
    </Fragment>
  );
};

const selectAPIEditAccount = (api) => api.u.user.edit;

const AccountDetails = () => {
  const ctx = useContext(GovUICtx);
  const displaySnackbar = useSnackbarView(
    <SnackbarSurface>&#x2713; Account updated</SnackbarSurface>,
  );

  const [_user, refreshUser] = useRefreshUser();

  const [locked, lock, unlock] = useFormLock();

  const {userid, username, first_name, last_name, email, creation_time, roles} =
    useAuthValue();

  const form = useForm({
    username,
    first_name,
    last_name,
  });

  const posthook = useCallback(
    (_res, _data) => {
      lock();
      refreshUser();
      displaySnackbar();
    },
    [displaySnackbar, refreshUser, lock],
  );
  const [edit, execEdit] = useAuthCall(
    selectAPIEditAccount,
    [form.state],
    {},
    {posthook},
  );

  return (
    <div>
      <h3>Account</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          <Form
            formState={form.state}
            onChange={form.update}
            onSubmit={execEdit}
          >
            <Field
              className="field-disabled-solid"
              name="username"
              label="Username"
              nohint
              disabled={locked}
              fullWidth
              autoComplete="username"
            />
            <Field
              className="field-disabled-solid"
              name="first_name"
              label="First name"
              nohint
              disabled={locked}
              fullWidth
              autoComplete="given-name"
            />
            <Field
              className="field-disabled-solid"
              name="last_name"
              label="Last name"
              nohint
              disabled={locked}
              fullWidth
              autoComplete="family-name"
            />
          </Form>
          <ButtonGroup>
            {locked ? (
              <Fragment>
                <FaIcon icon="lock" />
                <ButtonTertiary onClick={unlock}>Edit</ButtonTertiary>
              </Fragment>
            ) : (
              <Fragment>
                <FaIcon icon="unlock-alt" />
                <ButtonTertiary onClick={lock}>Cancel</ButtonTertiary>
                <ButtonPrimary onClick={execEdit}>Update account</ButtonPrimary>
              </Fragment>
            )}
          </ButtonGroup>
          {edit.err && <p>{edit.err.message}</p>}
        </Column>
        <Column fullWidth md={8}>
          <h5>Userid</h5>
          <code>{userid}</code>
          <h5>Email</h5>
          <span>{email}</span>
          <h5>Roles</h5>
          {roles.map((role) => (
            <Chip key={role}>{role}</Chip>
          ))}
          <p>
            Created <Time value={creation_time * 1000} />
          </p>
        </Column>
      </Grid>
      {ctx.enableUserProfile && <Profile />}
    </div>
  );
};

export default AccountDetails;
