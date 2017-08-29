import {h} from 'preact';
import Container from 'component/container';

import './section.scss';

const Section = ({id, container, padded, sectionTitle, children})=>{
  if(container){
    return <section id={id}>
      <Container padded={padded}>
        {sectionTitle && <h3 className="section-header">{sectionTitle}</h3>}
        {children}
      </Container>
    </section>;
  }

  return <section id={id}>
    {sectionTitle && <h3 className="section-header">{sectionTitle}</h3>}
    {children}
  </section>;
};

export default Section
