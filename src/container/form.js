import React, {Fragment, useState, useCallback} from 'react';
import {useSnackbar} from 'service/snackbar';
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

const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]+$/;
const formErrCheck = ({email}) => {
  const err = {};
  if (!emailRegex.test(email)) {
    Object.assign(err, {email: 'Not a valid email'});
  }
  return err;
};
const formValidCheck = ({email}) => {
  const valid = {};
  if (emailRegex.test(email)) {
    Object.assign(valid, {email: true});
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
    checkbox: false,
    radioval: false,
    fileval: undefined,
    lang: '200',
  });

  const logFormState = useCallback(() => {
    console.log(formState);
  }, [formState]);

  const snackbar = useSnackbar();

  const displaySnack = useCallback(() => {
    snackbar(
      <Fragment>
        <span>Hello, World</span>
        <Button>Reply</Button>
      </Fragment>,
    );
  }, [snackbar]);

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
        <Input label="Password" type="password" name="password" />
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
          error="checkbox error"
        />
        <Input
          label="Check me"
          info="This is a checkbox"
          type="checkbox"
          name="checkbox"
          valid
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
          error="radio error"
        />
        <Input
          label="Radio three"
          info="Radio button"
          type="radio"
          name="radioval"
          value="three"
          valid
        />
        <Input label="File" info="Choose a file" type="file" name="fileval" />
        <Input
          label="File"
          info="Choose a file"
          type="file"
          name="fileval"
          error="file error"
        />
        <Input
          label="File"
          info="Choose a file"
          type="file"
          name="fileval"
          valid
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
      </Form>
      <p>Dropdown value: {formState.lang}</p>
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
            <Button fixedWidth primary onClick={displaySnack}>
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
