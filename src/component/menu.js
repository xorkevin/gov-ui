import {h, Component} from 'preact';
import Portal from 'preact-portal';

class MenuContainer extends Component {
  tick(){
    const bounds = this.props.reference.getBoundingClientRect();
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {bounds, scrollY: window.scrollY});
    });
  }

  componentWillMount(){
    this.tick();
  }

  componentDidMount(){
    this.running = false;
    this.handler = ()=>{
      if(!this.running){
        this.running = true;
        window.requestAnimationFrame(()=>{
          this.tick()
          this.running = false;
        });
      }
    };
    window.addEventListener('resize', this.handler, true);
    window.addEventListener('scroll', this.handler, true);
  }

  componentWillUnmount(){
    if(this.handler){
      window.removeEventListener('resize', this.handler, true);
      window.removeEventListener('scroll', this.handler, true);
      this.handler = false;
    }
  }

  render({size, align, position, fixed, children}, {bounds, scrollY}){
    const k = ["menu"];
    const s = {};
    const t = {};

    switch(size){
      case "sm":
      case "md":
      case "lg":
        k.push(size);
    }

    t.left = bounds.width / 2;

    if(align === "right"){
      s.left = bounds.right;
      k.push("right");
      t.left *= -1;
    } else {
      s.left = bounds.left;
      k.push("left");
    }
    if(position === "top"){
      s.top = bounds.top;
      k.push("top");
    } else {
      s.top = bounds.bottom;
      k.push("bottom");
    }


    if(fixed){
      k.push("fixed");
    } else {
      s.top += scrollY;
    }

    return <div className={k.join(" ")} style={s}>
      <div className="menu-container">
        {children.map((child)=>{
          return <div className="item">{child}</div>;
        })}
      </div>
      <div className="triangle" style={t}></div>
    </div>;
  }
}

class Menu extends Component {
  constructor(props){
    super(props);
    this.state = {
      hidden: true,
    };
    this.toggleHidden = this.toggleHidden.bind(this);
    this.setHidden = this.setHidden.bind(this);
    this.setVisible = this.setVisible.bind(this);
  }

  setHidden(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {hidden: true});
    });
  }

  setVisible(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {hidden: false});
    });
  }

  toggleHidden(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {hidden: !prevState.hidden});
    });
  }

  componentDidMount(){
    this.handler = ()=>{
      this.setHidden();
    };
    window.addEventListener('click', this.handler, true);
  }

  componentWillUnmount(){
    if(this.handler){
      window.removeEventListener('click', this.handler, true);
    }
  }

  render({children, icon, size, align, position, fixed}, {hidden}){
    return <div onClick={this.toggleHidden} ref={(elem)=>{this.elem = elem;}}>
      <div className="menu-button">
        {icon}
      </div>
      {!hidden && <Portal into="body">
        <MenuContainer size={size} align={align} position={position} fixed={fixed} reference={this.elem}>
          {children}
        </MenuContainer>
      </Portal>}
    </div>;
  }
}

export default Menu
