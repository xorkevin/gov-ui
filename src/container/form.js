import React, {Fragment, useState, useCallback} from 'react';
import Section from 'component/section';
import Input, {useForm} from 'component/form';
import Card from 'component/card';
import Button from 'component/button';
import Table from 'component/table';

const TableData = [
  {
    key: 'Elrond',
    row: [
      {key: 'name', component: 'Elrond'},
      {
        key: 'desc',
        component:
          'a Half-elven conveyor, member of White Council and lord of Rivendell.',
      },
    ],
  },
  {
    key: 'Erestor',
    row: [
      {key: 'name', component: 'Erestor'},
      {
        key: 'desc',
        component:
          'an Elf-lord, advisor, and the chief of the House of Elrond.',
      },
    ],
  },
  {
    key: 'Gandalf the Grey',
    row: [
      {key: 'name', component: 'Gandalf the Grey'},
      {
        key: 'desc',
        component:
          'a Wizard, one of the Istari, and member of both the White Council and The Fellowship.',
      },
    ],
  },
  {
    key: 'Aragorn',
    row: [
      {key: 'name', component: 'Aragorn'},
      {
        key: 'desc',
        component:
          'a Ranger, heir of Isildur, member of The Fellowship, and Chieftain of the Dúnedain in the North.',
      },
    ],
  },
  {
    key: 'Frodo Baggins',
    row: [
      {key: 'name', component: 'Frodo Baggins'},
      {
        key: 'desc',
        component:
          'a Hobbit of the Shire, member of The Fellowship, and Ring-bearer.',
      },
    ],
  },
  {
    key: 'Bilbo Baggins',
    row: [
      {key: 'name', component: 'Bilbo Baggins'},
      {
        key: 'desc',
        component:
          'a Hobbit of the Shire, former Ring-bearer, uncle of Frodo and long resident in Rivendell.',
      },
    ],
  },
  {
    key: 'Boromir of Gondor',
    row: [
      {key: 'name', component: 'Boromir of Gondor'},
      {
        key: 'desc',
        component:
          'son of Denethor II Ruling Steward of Minas Tirith, and member of The Fellowship.',
      },
    ],
  },
  {
    key: 'Glóin of the Lonely Mountain',
    row: [
      {
        key: 'name',
        component: 'Glóin of the Lonely Mountain',
      },
      {
        key: 'desc',
        component:
          'representative of the King under the Mountain, Dain Ironfoot of the Dwarves.',
      },
    ],
  },
  {
    key: 'Gimli',
    row: [
      {key: 'name', component: 'Gimli'},
      {
        key: 'desc',
        component:
          'son of Gloin, member of The Fellowship, and dwarf of the Lonely Mountain.',
      },
    ],
  },
  {
    key: 'Legolas',
    row: [
      {key: 'name', component: 'Legolas'},
      {
        key: 'desc',
        component:
          'a Sindar Elf of the Woodland Realm (Mirkwood), son of Thranduil the Elvenking, and member of The Fellowship.',
      },
    ],
  },
  {
    key: 'Glorfindel',
    row: [
      {key: 'name', component: 'Glorfindel'},
      {
        key: 'desc',
        component:
          'an Elf-lord of Rivendell, rescuer of Frodo and his company from the Nine.',
      },
    ],
  },
  {
    key: 'Galdor of the Havens',
    row: [
      {key: 'name', component: 'Galdor of the Havens'},
      {key: 'desc', component: 'messenger from Círdan of the Grey Havens.'},
    ],
  },
];

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

  return (
    <Section id="form" sectionTitle="Form" container padded narrow>
      <Input
        label="Name"
        name="name"
        value={formState.name}
        onChange={updateForm}
      />
      <Input
        label="Email"
        name="email"
        value={formState.email}
        onChange={updateForm}
        error="not an email"
      />
      <Input
        label="Phone"
        info="10 digits"
        name="phone"
        value={formState.phone}
        onChange={updateForm}
        valid
      />
      <Input
        label="Tagline"
        info="What describes you?"
        name="tagline"
        value={formState.tagline}
        onChange={updateForm}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={formState.password}
        onChange={updateForm}
      />
      <Input
        label="Check me"
        info="This is a checkbox"
        type="checkbox"
        name="checkbox"
        checked={formState.checkbox}
        onChange={updateForm}
      />
      <Input
        label="Check me"
        info="This is a checkbox"
        type="checkbox"
        name="checkbox"
        checked={formState.checkbox}
        onChange={updateForm}
        error="checkbox error"
      />
      <Input
        label="Check me"
        info="This is a checkbox"
        type="checkbox"
        name="checkbox"
        checked={formState.checkbox}
        onChange={updateForm}
        valid
      />
      <Input
        label="Radio one"
        info="Radio button"
        type="radio"
        name="radioval"
        value="one"
        checked={formState.radioval}
        onChange={updateForm}
      />
      <Input
        label="Radio two"
        info="Radio button"
        type="radio"
        name="radioval"
        value="two"
        checked={formState.radioval}
        onChange={updateForm}
        error="radio error"
      />
      <Input
        label="Radio three"
        info="Radio button"
        type="radio"
        name="radioval"
        value="three"
        checked={formState.radioval}
        onChange={updateForm}
        valid
      />
      <Input
        label="File"
        info="Choose a file"
        type="file"
        name="fileval"
        onChange={updateForm}
      />
      <Input
        label="File"
        info="Choose a file"
        type="file"
        name="fileval"
        onChange={updateForm}
        error="file error"
      />
      <Input
        label="File"
        info="Choose a file"
        type="file"
        name="fileval"
        onChange={updateForm}
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
        value={formState.lang}
        onChange={updateForm}
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
        value={formState.lang}
        onChange={updateForm}
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
        value={formState.lang}
        onChange={updateForm}
        valid
      />
      <p>Dropdown value: {formState.lang}</p>
      <Button fixedWidth primary onClick={() => console.log(formState)}>
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
            <Button fixedWidth primary>
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
          head={[
            {key: 'name', component: 'name'},
            {key: 'desc', component: 'description'},
          ]}
          data={TableData}
        />
      </Section>
    </Section>
  );
};

export default FormContainer;
