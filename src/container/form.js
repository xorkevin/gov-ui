import React, {Fragment, useState, useCallback} from 'react';
import Section from 'component/section';
import Input from 'component/form';
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
  const [formState, setFormState] = useState({
    checkbox: false,
    radioval: false,
    lang: '200',
  });

  const setCheckbox = useCallback(
    (val) => setFormState((prev) => Object.assign({}, prev, {checkbox: val})),
    [setFormState],
  );
  const setRadio = useCallback(
    (val) => setFormState((prev) => Object.assign({}, prev, {radioval: val})),
    [setFormState],
  );
  const setLang = useCallback(
    (val) => setFormState((prev) => Object.assign({}, prev, {lang: val})),
    [setFormState],
  );
  const setFile = useCallback((val) => console.log('File:', val));

  return (
    <Section id="form" sectionTitle="Form" container padded narrow>
      <Input label="Name" />
      <Input label="Email" error="not an email" />
      <Input label="Phone" valid info="10 digits" />
      <Input label="Tagline" info="What describes you?" />
      <Input label="Password" type="password" />
      <Input
        type="checkbox"
        label="Check me"
        checked={formState.checkbox}
        onChange={setCheckbox}
        info="This is a checkbox"
      />
      <Input
        type="checkbox"
        label="Check me"
        checked={formState.checkbox}
        onChange={setCheckbox}
        error="checkbox error"
        info="This is a checkbox"
      />
      <Input
        type="checkbox"
        label="Check me"
        checked={formState.checkbox}
        onChange={setCheckbox}
        valid
        info="This is a checkbox"
      />
      <Input
        type="radio"
        label="Radio one"
        value="one"
        checked={formState.radioval}
        onChange={setRadio}
        info="Radio button"
      />
      <Input
        type="radio"
        label="Radio two"
        value="two"
        checked={formState.radioval}
        onChange={setRadio}
        error="radio error"
        info="Radio button"
      />
      <Input
        type="radio"
        label="Radio three"
        value="three"
        checked={formState.radioval}
        onChange={setRadio}
        valid
        info="Radio button"
      />
      <Input type="file" label="File" onChange={setFile} info="Choose a file" />
      <Input
        type="file"
        label="File"
        onChange={setFile}
        error="file error"
        info="Choose a file"
      />
      <Input
        type="file"
        label="File"
        onChange={setFile}
        valid
        info="Choose a file"
      />
      <Input
        label="Language"
        info="Your favorite language"
        value={formState.lang}
        onChange={setLang}
        dropdown={[
          {text: 'Rust', value: '100'},
          {text: 'Go', value: '200'},
          {text: 'Javascript', value: '300'},
          {text: 'Python', value: '400'},
          {text: 'Prolog', value: '500'},
        ]}
      />
      <Input
        label="Language"
        error="select error"
        info="Your favorite language"
        value={formState.lang}
        onChange={setLang}
        dropdown={[
          {text: 'Rust', value: '100'},
          {text: 'Go', value: '200'},
          {text: 'Javascript', value: '300'},
          {text: 'Python', value: '400'},
          {text: 'Prolog', value: '500'},
        ]}
      />
      <Input
        label="Language"
        valid
        info="Your favorite language"
        value={formState.lang}
        onChange={setLang}
        dropdown={[
          {text: 'Rust', value: '100'},
          {text: 'Go', value: '200'},
          {text: 'Javascript', value: '300'},
          {text: 'Python', value: '400'},
          {text: 'Prolog', value: '500'},
        ]}
      />
      <p>Dropdown value: {formState.lang}</p>
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
