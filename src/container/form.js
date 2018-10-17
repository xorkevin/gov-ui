import {h, Component} from 'preact';
import linkState from 'linkstate';
import Section from 'component/section';
import Input from 'component/form';
import Card from 'component/card';
import Button from 'component/button';

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '200',
    };
  }

  render({}, {lang}) {
    return (
      <Section id="form" sectionTitle="Form" container padded narrow>
        <Input label="Name" />
        <Input label="Email" error="not an email" />
        <Input label="Phone" valid />
        <Input label="Tagline" info="What describes you?" />
        <Input type="checkbox" label="Check me" info="This is a checkbox" />
        <Input type="radio" label="Radio" info="Radio button" />
        <Input type="file" label="File" info="Choose a file" />
        <Input
          label="Language"
          info="Your favorite language"
          value={lang}
          onChange={linkState(this, 'lang')}
          dropdown={[
            {text: 'Rust', value: '100'},
            {text: 'Go', value: '200'},
            {text: 'Javascript', value: '300'},
            {text: 'Python', value: '400'},
            {text: 'Prolog', value: '500'},
          ]}
        />
        <p>Dropdown value: {lang}</p>
        <Card
          size="lg"
          restrictWidth
          titleBar
          title={[<h3>Vivamus nibh enim</h3>]}
          bar={[
            <Button fixedWidth text>
              Cancel
            </Button>,
            <Button fixedWidth outline>
              Save
            </Button>,
            <Button fixedWidth primary>
              Submit
            </Button>,
          ]}
        >
          <Input
            textarea
            fullWidth
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
      </Section>
    );
  }
}

export default FormContainer;
