import {h, Component} from 'preact';
import {isWeb} from 'utility';

class MainContent extends Component {
  constructor(props){
    super(props);

    if(isWeb()){
      if(props.dark){
        document.body.classList.add('dark');
      }
    }
  }

  componentWillReceiveProps(nextProps){
    if(isWeb()){
      if(nextProps.dark){
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }

  componentWillUnmount(){
    if(isWeb()){
      document.body.classList.remove('dark');
    }
  }

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
