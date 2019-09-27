import React, {Fragment, useCallback} from 'react';
import {emailRegex} from 'utility';
import {useSnackbarView} from 'service/snackbar';
import Section from 'component/section';
import {Form, Input, useForm} from 'component/form';
import Card from 'component/card';
import Button from 'component/button';
import Table from 'component/table';
import Tabbar from 'component/tabbar';
import FaIcon from 'component/faicon';

const TableData = [
  {
    name: 'Elrond',
    description:
      'a Half-elven conveyor, member of White Council and lord of Rivendell.',
  },
  {
    name: 'Erestor',
    description: 'an Elf-lord, advisor, and the chief of the House of Elrond.',
  },
  {
    name: 'Gandalf the Grey',
    description:
      'a Wizard, one of the Istari, and member of both the White Council and The Fellowship.',
  },
  {
    name: 'Aragorn',
    description:
      'a Ranger, heir of Isildur, member of The Fellowship, and Chieftain of the Dúnedain in the North.',
  },
  {
    name: 'Frodo Baggins',
    description:
      'a Hobbit of the Shire, member of The Fellowship, and Ring-bearer.',
  },
  {
    name: 'Bilbo Baggins',
    description:
      'a Hobbit of the Shire, former Ring-bearer, uncle of Frodo and long resident in Rivendell.',
  },
  {
    name: 'Boromir of Gondor',
    description:
      'son of Denethor II Ruling Steward of Minas Tirith, and member of The Fellowship.',
  },
  {
    name: 'Glóin of the Lonely Mountain',
    description:
      'representative of the King under the Mountain, Dain Ironfoot of the Dwarves.',
  },
  {
    name: 'Gimli',
    description:
      'son of Gloin, member of The Fellowship, and dwarf of the Lonely Mountain.',
  },
  {
    name: 'Legolas',
    description:
      'a Sindar Elf of the Woodland Realm (Mirkwood), son of Thranduil the Elvenking, and member of The Fellowship.',
  },
  {
    name: 'Glorfindel',
    description:
      'an Elf-lord of Rivendell, rescuer of Frodo and his company from the Nine.',
  },
  {
    name: 'Galdor of the Havens',
    description: 'messenger from Círdan of the Grey Havens.',
  },
];

const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
const imageSetType = new Set(['image/png', 'image/jpeg']);
const formErrCheck = ({
  email,
  phone,
  password,
  confirm_password,
  checkbox2,
  radioval,
  fileval,
}) => {
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
  if (checkbox2) {
    Object.assign(err, {checkbox2: true});
  }
  if (radioval === 'two') {
    Object.assign(err, {radioval: true});
  }
  if (fileval && !imageSetType.has(fileval.type)) {
    Object.assign(err, {fileval: 'File must be a png or jpeg'});
  }
  return err;
};
const formValidCheck = ({
  name,
  email,
  phone,
  password,
  confirm_password,
  checkbox,
  radioval,
  fileval,
  lang,
}) => {
  const valid = {};
  if (name.length > 0) {
    Object.assign(valid, {name: true});
  }
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
  if (checkbox) {
    Object.assign(valid, {checkbox: true});
  }
  if (radioval === 'one') {
    Object.assign(valid, {radioval: true});
  }
  if (fileval && imageSetType.has(fileval.type)) {
    Object.assign(valid, {fileval: true});
  }
  if (lang === '100' || lang === '200') {
    Object.assign(valid, {lang: true});
  }
  return valid;
};

const FormContainer = () => {
  const [formState, updateForm] = useForm({
    name: '',
    email: '',
    phone: '',
    tagline: '',
    password: '',
    confirm_password: '',
    checkbox: false,
    checkbox2: false,
    radioval: false,
    fileval: undefined,
    lang: '200',
    editor: 'Vim',
  });

  const logFormState = useCallback(() => {
    console.log(formState);
  }, [formState]);

  const displaySnackbar = useSnackbarView(
    <Fragment>
      <span>Hello, World</span>
      <Button>Reply</Button>
    </Fragment>,
  );

  return (
    <Section id="form" sectionTitle="Form" container padded narrow>
      <Form
        formState={formState}
        onChange={updateForm}
        onEnter={logFormState}
        errCheck={formErrCheck}
        validCheck={formValidCheck}
      >
        <Input label="Name" name="name" />
        <Input label="Email" name="email" info="name@example.com" />
        <Input label="Phone" name="phone" info="xxx-xxx-xxxx" />
        <Input label="Tagline" name="tagline" info="What describes you?" />
        <Input
          label="Password"
          type="password"
          name="password"
          info="Must be at least 10 chars"
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirm_password"
        />
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
          name="checkbox"
        />
        <Input
          label="Check me"
          info="This is a checkbox"
          type="checkbox"
          name="checkbox2"
        />
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
        <Input
          label="File"
          type="file"
          name="fileval"
          accept="image/png, image/jpeg"
          info="Choose an image"
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
          name="lang"
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
          name="lang"
          valid
        />
        <Input
          label="Editor"
          info="Your favorite text editor"
          fuzzyselect={[{value: 'Ed'}, {value: 'Vim'}, {value: 'Emacs'}]}
          name="editor"
        />
        <Input
          label="Editor"
          info="Your favorite text editor"
          fuzzyselect={[{value: 'Ed'}, {value: 'Vim'}, {value: 'Emacs'}]}
          name="editor"
          error="fuzzy error"
        />
        <Input
          label="Editor"
          info="Your favorite text editor"
          fuzzyselect={[{value: 'Ed'}, {value: 'Vim'}, {value: 'Emacs'}]}
          name="editor"
          valid
        />
      </Form>
      <Button fixedWidth primary onClick={logFormState}>
        Submit
      </Button>
      <Card
        size="lg"
        restrictWidth
        titleBar
        title={<h3>Vivamus nibh enim</h3>}
        bar={
          <Fragment>
            <Button fixedWidth text>
              Cancel
            </Button>
            <Button fixedWidth outline>
              Save
            </Button>
            <Button fixedWidth primary onClick={displaySnackbar}>
              Submit
            </Button>
          </Fragment>
        }
      >
        <Input
          textarea
          fullWidth
          label="Biography"
          info="Tell us about yourself"
        />
        <Input
          textarea
          fullWidth
          error="textarea error"
          label="Biography"
          info="Tell us about yourself"
        />
        <Input
          textarea
          fullWidth
          valid
          label="Biography"
          info="Tell us about yourself"
        />
      </Card>

      <Section subsection sectionTitle="Buttons">
        <Button fixedWidth primary>
          Primary
        </Button>
        <Button fixedWidth outline>
          Outline
        </Button>
        <Button fixedWidth text>
          Text
        </Button>
        <Button raised fixedWidth primary>
          Raised Primary
        </Button>
        <Button raised fixedWidth outline>
          Raised Outline
        </Button>
        <Button raised fixedWidth text>
          Raised Text
        </Button>
      </Section>

      <Section subsection sectionTitle="Table">
        <Table
          head={
            <Fragment>
              <th>name</th>
              <th>description</th>
            </Fragment>
          }
        >
          {TableData.map(({name, description}) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{description}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section subsection sectionTitle="Tabs">
        <Tabbar
          left={
            <Fragment>
              <div>
                <FaIcon icon="newspaper-o" /> Newsfeed
              </div>
              <div>
                <FaIcon icon="fire" /> Popular
              </div>
              <div>
                <FaIcon icon="users" /> Friends
              </div>
              <div>
                <FaIcon icon="paper-plane" /> Post
              </div>
            </Fragment>
          }
          right={
            <Fragment>
              <div>
                <FaIcon icon="user" /> Profile
              </div>
              <div>
                <FaIcon icon="cog" /> Settings
              </div>
            </Fragment>
          }
        />
      </Section>
    </Section>
  );
};

export default FormContainer;
