import React, {Component} from 'react';
import Container from 'component/container';

const scrollTime = 384;
const scrollTimeSqrt = Math.sqrt(scrollTime);
const navHeight = 64;
const scrollDistanceCap = 4096;
const scrollTriggerMargin = 8;

const easing = (t) => {
  if (t < 0.5) {
    return 4 * t * t * t;
  } else {
    return (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

const scrollTo = (element) => {
  const startingY = window.pageYOffset;
  let elementY = 0;
  if (typeof element === 'string') {
    elementY =
      window.scrollY +
      document.getElementById(element).getBoundingClientRect().top;
  }
  let targetY = elementY - navHeight;
  if (targetY < 0) {
    targetY = 0;
  }
  const scrollHeight = document.body.scrollHeight;
  const innerHeight = window.innerHeight;
  if (scrollHeight - elementY < innerHeight) {
    targetY = scrollHeight - innerHeight;
  }
  const diff = targetY - startingY;
  let start;
  if (!diff) {
    return;
  }
  const duration = Math.min(
    Math.sqrt((Math.abs(diff) * scrollTime) / scrollDistanceCap) *
      scrollTimeSqrt,
    scrollTime,
  );
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) {
      start = timestamp;
    }
    const time = timestamp - start;
    window.scrollTo(0, startingY + diff * easing(Math.min(time / duration, 1)));
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  });
};

const Navitem = ({home, scroll, children}) => {
  const className = ['item'];
  if (home) {
    className.push('nav-home');
  }
  const itemProps = {};
  if (scroll) {
    itemProps.onClick = () => {
      scrollTo(scroll);
    };
  }
  return (
    <div className={className.join(' ')} {...itemProps}>
      {children}
    </div>
  );
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: false,
      hidden: false,
    };
    this.position = window.pageYOffset;
  }

  tickTop() {
    const position = window.pageYOffset;
    if (position < 256) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {top: true});
      });
    } else {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {top: false});
      });
    }
  }

  tick() {
    const nextPosition = window.pageYOffset;
    const diff = nextPosition - this.position;
    if (Math.abs(diff) > scrollTriggerMargin) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {hidden: diff > 0});
      });
      this.position = nextPosition;
    }
  }

  unbind() {
    if (this.handlerTop) {
      window.removeEventListener('scroll', this.handlerTop);
      this.handlerTop = false;
    }
    if (this.handler) {
      window.removeEventListener('scroll', this.handler);
      this.handler = false;
    }
  }

  componentDidMount() {
    if (!this.props.sidebar) {
      this.runningTop = false;
      this.handlerTop = () => {
        if (!this.runningTop) {
          this.runningTop = true;
          window.requestAnimationFrame(() => {
            this.tickTop();
            this.runningTop = false;
          });
        }
      };
      window.addEventListener('scroll', this.handlerTop);
      this.handlerTop();
    }
    if (!this.props.sidebar && this.props.hideOnScroll) {
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
      window.addEventListener('scroll', this.handler);
      this.handler();
    }
  }

  componentWillUnmount() {
    this.unbind();
  }

  render() {
    const {sidebar, left, right, styletop, children} = this.props;
    const {top, hidden} = this.state;
    const className = [];
    if (sidebar) {
      className.push('sidebar');
    }
    if (!sidebar && !top && hidden) {
      className.push('hidden');
    }
    if (styletop && top) {
      className.push('top');
    }

    return (
      <nav className={className.join(' ')}>
        <div className="nav-container">
          <Container>
            <div className="element">{left}</div>
            {children && <div className="element">{children}</div>}
            <div className="element">{right}</div>
          </Container>
        </div>
      </nav>
    );
  }
}

export {Navbar, Navitem, Navbar as default};
