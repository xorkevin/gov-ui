import {h, Component} from 'preact';
import Container from 'component/container';

const generateItemList = (list) => {
  return list.map((item) => {
    return (
      <div key={item.key} className="item">
        {item.component}
      </div>
    );
  });
};

class Tabbar extends Component {
  render({left, right, children}) {
    const className = ['tabbar'];
    let j = false;
    let k = false;
    if (left) {
      j = generateItemList(left);
    }
    if (right) {
      k = generateItemList(right);
    }
    return (
      <div className={className.join(' ')}>
        <Container>
          <div className="element">{j}</div>
          {children &&
            children.length > 0 && <div className="element">{children}</div>}
          <div className="element">{k}</div>
        </Container>
      </div>
    );
  }
}

export default Tabbar;
