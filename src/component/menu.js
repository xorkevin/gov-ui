import React, {useState, useEffect, useCallback, useRef} from 'react';
import ReactDOM from 'react-dom';

const MenuSizeSet = new Set(['sm', 'md', 'lg']);

const MenuContainer = ({
  size,
  align,
  position,
  fixed,
  reference,
  close,
  children,
}) => {
  const [bounds, setBounds] = useState(
    reference.current.getBoundingClientRect(),
  );
  const [scrollY, setScrollY] = useState(window.scrollY);

  useEffect(() => {
    let running = false;
    const handler = () => {
      if (!running) {
        running = true;
        window.requestAnimationFrame(() => {
          setBounds(reference.current.getBoundingClientRect());
          setScrollY(window.scrollY);
          running = false;
        });
      }
    };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);
    window.addEventListener('click', close);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
      window.removeEventListener('click', close);
    };
  }, [reference.current, close, setBounds, setScrollY]);

  const k = ['menu'];
  const s = {};
  const t = {
    left: bounds.width / 2,
  };

  if (MenuSizeSet.has(size)) {
    k.push(size);
  }

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

  return (
    <div className={k.join(' ')} style={s}>
      <div className="menu-container">{children}</div>
      <div className="triangle" style={t} />
    </div>
  );
};

const Menu = ({icon, size, align, position, fixed, children}) => {
  const [hidden, setHidden] = useState(true);
  const menuelem = useRef(null);

  const setHiddenHandler = useCallback(() => {
    setHidden(true);
  }, [setHidden]);

  const toggleHidden = useCallback(
    (e) => {
      e.stopPropagation();
      setHidden((h) => !h);
    },
    [setHidden],
  );

  return (
    <div className="menu-button" onClick={toggleHidden} ref={menuelem}>
      {icon}
      {menuelem.current &&
        !hidden &&
        ReactDOM.createPortal(
          <MenuContainer
            size={size}
            align={align}
            position={position}
            fixed={fixed}
            reference={menuelem}
            close={setHiddenHandler}
          >
            {children}
          </MenuContainer>,
          document.body,
        )}
    </div>
  );
};

export default Menu;
