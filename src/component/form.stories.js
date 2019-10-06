import React, {Fragment, useMemo} from 'react';
import {Form, Input, useForm, fuzzyFilter} from 'component/form';
import {emailRegex} from 'utility';

export default {title: 'Form'};

export const plain = () => <Input label="Name" name="name" />;

export const wide = () => <Input wide label="Name" name="name" />;

export const fullWidth = () => <Input fullWidth label="Name" name="name" />;

export const info = () => (
  <Input label="Tagline" name="tagline" info="What describes you?" />
);

export const textarea = () => (
  <Input textarea label="Bio" name="bio" info="Tell us about yourself" />
);

const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
const imageSetType = new Set(['image/png', 'image/jpeg']);
const formErrCheck = ({email, phone, password, confirm_password}) => {
  const err = {};
  if (email.length > 0 && !emailRegex.test(email)) {
    Object.assign(err, {email: true});
  }
  if (phone.length > 0 && !phoneRegex.test(phone)) {
    Object.assign(err, {phone: true});
  }
  if (password.length > 0 && password.length < 10) {
    Object.assign(err, {password: true});
  }
  if (confirm_password.length > 0 && confirm_password !== password) {
    Object.assign(err, {confirm_password: 'Must match password'});
  }
  return err;
};
const formValidCheck = ({email, phone, password, confirm_password}) => {
  const valid = {};
  if (emailRegex.test(email)) {
    Object.assign(valid, {email: true});
  }
  if (phoneRegex.test(phone)) {
    Object.assign(valid, {phone: true});
  }
  if (password.length > 9) {
    Object.assign(valid, {password: true});
  }
  if (password.length > 0 && confirm_password === password) {
    Object.assign(valid, {confirm_password: true});
  }
  return valid;
};

export const validation = () => {
  const [formState, updateForm] = useForm({
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  return (
    <Form
      formState={formState}
      onChange={updateForm}
      errCheck={formErrCheck}
      validCheck={formValidCheck}
    >
      <Input label="Email" name="email" info="name@example.com" />
      <Input label="Phone" name="phone" info="xxx-xxx-xxxx" />
      <Input
        label="Password"
        type="password"
        name="password"
        info="Must be at least 10 chars"
      />
      <Input label="Confirm password" type="password" name="confirm_password" />
    </Form>
  );
};

export const checkbox = () => (
  <Fragment>
    <Input
      label="Check me"
      info="This is a checkbox"
      type="checkbox"
      name="checkbox"
    />
    <Input
      label="Check me"
      info="This is a checkbox"
      type="checkbox"
      name="checkbox2"
      error="checkbox error"
    />
    <Input
      label="Check me"
      info="This is a checkbox"
      type="checkbox"
      name="checkbox3"
      valid
    />
  </Fragment>
);

export const toggle = () => (
  <Input
    label="Toggle me"
    info="This is a toggle"
    type="checkbox"
    toggle
    name="toggle"
  />
);

export const radio = () => {
  const [formState, updateForm] = useForm({
    name: '',
    email: '',
    phone: '',
    tagline: '',
    password: '',
    confirm_password: '',
    checkbox: false,
    checkbox2: false,
    toggle: false,
    radioval: false,
    fileval: undefined,
    lang: '200',
    tool: '',
    tool2: [],
  });

  return (
    <Form formState={formState} onChange={updateForm}>
      <Input
        label="Radio one"
        info="Radio button"
        type="radio"
        name="radioval"
        value="one"
      />
      <Input
        label="Radio two"
        info="Radio button"
        type="radio"
        name="radioval"
        value="two"
      />
      <Input
        label="Radio three"
        info="Radio button"
        type="radio"
        name="radioval"
        value="three"
      />
    </Form>
  );
};

export const file = () => (
  <Input
    label="File"
    type="file"
    name="fileval"
    accept="image/png, image/jpeg"
    info="Choose an image"
  />
);

export const dropdown = () => (
  <Fragment>
    <Input
      label="Language"
      info="Your favorite language"
      dropdown={[
        {text: 'Rust', value: '100'},
        {text: 'Go', value: '200'},
        {text: 'Javascript', value: '300'},
        {text: 'Python', value: '400'},
        {text: 'Prolog', value: '500'},
      ]}
      name="lang"
    />
    <Input
      label="Language"
      info="Your favorite language"
      dropdown={[
        {text: 'Rust', value: '100'},
        {text: 'Go', value: '200'},
        {text: 'Javascript', value: '300'},
        {text: 'Python', value: '400'},
        {text: 'Prolog', value: '500'},
      ]}
      name="lang2"
      error="select error"
    />
    <Input
      label="Language"
      info="Your favorite language"
      dropdown={[
        {text: 'Rust', value: '100'},
        {text: 'Go', value: '200'},
        {text: 'Javascript', value: '300'},
        {text: 'Python', value: '400'},
        {text: 'Prolog', value: '500'},
      ]}
      name="lang3"
      valid
    />
  </Fragment>
);

const Tools = [
  {value: 'man'},
  {value: 'ls'},
  {value: 'pwd'},
  {value: 'cd'},
  {value: 'cat'},
  {value: 'echo'},
  {value: 'tee'},
  {value: 'head'},
  {value: 'tail'},
  {value: 'less'},
  {value: 'more'},
  {value: 'tr'},
  {value: 'cut'},
  {value: 'awk'},
  {value: 'sed'},
  {value: 'sort'},
  {value: 'grep'},
  {value: 'wc'},
  {value: 'bc'},
  {value: 'diff'},
  {value: 'patch'},
  {value: 'chmod'},
  {value: 'chown'},
  {value: 'cp'},
  {value: 'mv'},
  {value: 'rm'},
  {value: 'ln'},
  {value: 'date'},
  {value: 'df'},
  {value: 'du'},
  {value: 'find'},
  {value: 'xargs'},
  {value: 'ed'},
  {value: 'vi'},
  {value: 'vim'},
  {value: 'nvim'},
  {value: 'emacs'},
  {value: 'nano'},
  {value: 'tar'},
];

const getEditorVal = (i) => i.value;

export const dropdownInput = () => {
  const [formState, updateForm] = useForm({
    tool: '',
  });

  const tools = useMemo(
    () => fuzzyFilter(8, Tools, getEditorVal, formState.tool),
    [formState.tool],
  );

  return (
    <Form formState={formState} onChange={updateForm}>
      <Input
        label="Unix tool"
        info="Your favorite unix tool"
        dropdowninput={tools}
        name="tool"
      />
    </Form>
  );
};

export const dropdownInputMultiple = () => {
  const [formState, updateForm] = useForm({
    tool: '',
  });

  const tools = useMemo(
    () => fuzzyFilter(8, Tools, getEditorVal, formState._search_tool),
    [formState._search_tool],
  );

  return (
    <Form formState={formState} onChange={updateForm}>
      <Input
        label="Unix tool"
        info="Your favorite unix tool"
        multiple
        dropdowninput={tools}
        name="tool"
      />
    </Form>
  );
};
