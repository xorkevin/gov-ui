import {h} from 'preact';
import Container from 'component/container';

const Footer = ({children})=>{
  return <footer>
    <Container padded narrow>
      {children}
    </Container>
  </footer>;
};

export default Footer
