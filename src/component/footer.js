import {h} from 'preact';
import Container from 'component/container';

const Footer = ({children})=>{
  return <footer>
    <Container padded>
      {children}
    </Container>
  </footer>;
};

export default Footer
