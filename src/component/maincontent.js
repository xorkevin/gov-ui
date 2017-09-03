import {h} from 'preact';

import './maincontent.scss';

const MainContent = ({children})=>{
  return <main>
    {children}
  </main>;
};

export default MainContent
