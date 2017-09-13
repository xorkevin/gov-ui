import {h, Component} from 'preact';

class Menu extends Component {
  render({children, icon, align, position}, {hidden}){
    const k = ["menu"];
    switch(align){
      case "left":
      case "right":
        k.push(align);
    }
    switch(position){
      case "top":
      case "bottom":
        k.push(position);
    }
    return <div className={k.join(" ")}>
      <div className="menu-button">
        {icon}
      </div>
      <div className="menu-container">
        {children}
      </div>
    </div>;
  }
}

export default Menu
