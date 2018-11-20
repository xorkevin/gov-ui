import {h, Component} from 'preact';
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
  if (element) {
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

const generateItemList = (list) => {
  return list.map((item) => {
    const className = ['item'];
    if (item.home) {
      className.push('nav-home');
    }
    const itemProps = {};
    if (item.scroll) {
      itemProps.onClick = () => {
        scrollTo(item.target);
      };
    }
    return (
      <div key={item.key} className={className.join(' ')} {...itemProps}>
        {item.component}
      </div>
    );
  });
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
    this.position = window.pageYOffset;
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
    if (this.handler) {
      window.removeEventListener('scroll', this.handler);
      this.handler = false;
    }
  }

  componentDidMount() {
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

  render({sidebar, left, right, children}, {hidden}) {
    const className = [];
    if (sidebar) {
      className.push('sidebar');
    }
    if (hidden) {
      className.push('hidden');
    }
    let j = false;
    let k = false;
    if (left) {
      j = generateItemList(left);
    }
    if (right) {
      k = generateItemList(right);
    }
    return (
      <nav className={className.join(' ')}>
        <div className="nav-container">
          <Container>
            <div className="element">{j}</div>
            {children && children.length > 0 && (
              <div className="element">{children}</div>
            )}
            <div className="element">{k}</div>
          </Container>
        </div>
      </nav>
    );
  }
}

export default Navbar;
