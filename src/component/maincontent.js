import {h, Component} from 'preact';

class MainContent extends Component {
  render({withSidebar, withNavbar, sectionNoMargin, children}){
    const k = [];
    if(withSidebar){
      k.push("with-sidebar");
    }
    if(withNavbar){
      k.push("with-navbar");
    }
    if(sectionNoMargin){
      k.push("section-no-margin");
    }

    return <main className={k.join(" ")}>
      {children}
    </main>;
  }
}

export default MainContent
