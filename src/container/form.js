import {h} from 'preact';
import Section from 'component/section';
import Input from 'component/form';
import Card from 'component/card';
import Button from 'component/button';

const FormContainer = ()=>{
  return <div>
    <Section id="form" sectionTitle="Form" container padded narrow>
      <Input label="Name"/>
      <Input label="Email" error="not an email"/>
      <Input label="Phone" valid/>
      <Input label="Tagline" info="What describes you?"/>
      <Card size="lg" restrictWidth titleBar title={[
          <h3>Vivamus nibh enim</h3>
        ]} bar={[
          <Button fixedWidth text>Cancel</Button>,
          <Button fixedWidth outline>Save</Button>,
          <Button fixedWidth primary>Submit</Button>
        ]}>
        <Input textarea fullWidth label="Biography" info="Tell us about yourself"/>
      </Card>

      <Section subsection sectionTitle="Buttons">
        <Button fixedWidth primary>Primary</Button>
        <Button fixedWidth outline>Outline</Button>
        <Button fixedWidth text>Text</Button>
        <Button raised fixedWidth primary>Raised Primary</Button>
        <Button raised fixedWidth outline>Raised Outline</Button>
        <Button raised fixedWidth text>Raised Text</Button>
      </Section>
    </Section>
  </div>;
};

export default FormContainer
