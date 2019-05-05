import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class MenuContainer extends Component {
  tick() {
    const bounds = this.props.reference.getBoundingClientRect();
    this.setState((prevState) => {
      return Object.assign({}, prevState, {bounds, scrollY: window.scrollY});
    });
  }

  componentWillMount() {
    this.tick();
  }

  componentDidMount() {
    this.running = false;
    this.handler = () => {
      if (!this.running) {
        this.running = true;
        window.requestAnimationFrame(() => {
          this.tick();
          this.running = false;
        });
      }
    };
    this.handlerClick = () => {
      this.props.close();
    };
    window.addEventListener('resize', this.handler, true);
    window.addEventListener('scroll', this.handler, true);
    window.addEventListener('click', this.handlerClick);
  }

  componentWillUnmount() {
    if (this.handler) {
      window.removeEventListener('resize', this.handler, true);
      window.removeEventListener('scroll', this.handler, true);
      this.handler = false;
    }
    if (this.handlerClick) {
      window.removeEventListener('click', this.handlerClick);
      this.handlerClick = false;
    }
  }

  render() {
    const {size, align, position, fixed, children} = this.props;
    const {bounds, scrollY} = this.state;
    const k = ['menu'];
    const s = {};
    const t = {};

    switch (size) {
      case 'sm':
      case 'md':
      case 'lg':
        k.push(size);
    }

    if (bounds) {
      t.left = bounds.width / 2;
      if (align === 'right') {
        s.left = bounds.right;
        k.push('right');
        t.left *= -1;
      } else {
        s.left = bounds.left;
        k.push('left');
      }
      if (position === 'top') {
        s.top = bounds.top;
        k.push('top');
      } else {
        s.top = bounds.bottom;
        k.push('bottom');
      }
      if (fixed) {
        k.push('fixed');
      } else {
        s.top += scrollY;
      }
    }

    return (
      <div className={k.join(' ')} style={s}>
        <div className="menu-container">
          {children.map((child) => {
            return <div className="item">{child}</div>;
          })}
        </div>
        <div className="triangle" style={t} />
      </div>
    );
  }
}

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
    };
    this.toggleHidden = this.toggleHidden.bind(this);
    this.setHidden = this.setHidden.bind(this);
    this.setVisible = this.setVisible.bind(this);
  }

  setHidden() {
    this.setState((prevState) => {
      return Object.assign({}, prevState, {hidden: true});
    });
  }

  setVisible() {
    this.setState((prevState) => {
      return Object.assign({}, prevState, {hidden: false});
    });
  }

  toggleHidden(e) {
    e.stopPropagation();
    this.setState((prevState) => {
      return Object.assign({}, prevState, {hidden: !prevState.hidden});
    });
  }

  render({children, icon, size, align, position, fixed}, {hidden}) {
    return (
      <div
        className="menu-button"
        onClick={this.toggleHidden}
        ref={(elem) => {
          this.elem = elem;
        }}
      >
        {icon}
        {!hidden &&
          ReactDOM.createPortal(
            <MenuContainer
              size={size}
              align={align}
              position={position}
              fixed={fixed}
              reference={this.elem}
              close={this.setHidden}
            >
              {children}
            </MenuContainer>,
            document.body,
          )}
      </div>
    );
  }
}

export default Menu;
