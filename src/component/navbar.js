import React, {useState, useEffect, useMemo} from 'react';
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

  const onClickHandler = useMemo(() => {
    if (scroll) {
      return () => {
        scrollTo(scroll);
      };
    }
    return undefined;
  }, [scroll, scrollTo]);

  return (
    <div className={className.join(' ')} onClick={onClickHandler}>
      {children}
    </div>
  );
};

const Navbar = ({sidebar, left, right, hideOnScroll, styletop, children}) => {
  const [top, setTop] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (sidebar) {
      return;
    }
    let running = false;
    const handler = () => {
      if (!running) {
        running = true;
        window.requestAnimationFrame(() => {
          const position = window.pageYOffset;
          if (position < 256) {
            setTop(true);
          } else {
            setTop(false);
          }
          running = false;
        });
      }
    };
    window.addEventListener('scroll', handler);
    handler();
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [sidebar, setTop]);

  useEffect(() => {
    if (sidebar || !hideOnScroll) {
      return;
    }
    let position = window.pageYOffset;
    let running = false;
    const handler = () => {
      if (!running) {
        running = true;
        window.requestAnimationFrame(() => {
          const nextPosition = window.pageYOffset;
          const diff = nextPosition - position;
          if (Math.abs(diff) > scrollTriggerMargin) {
            setHidden(diff > 0);
            position = nextPosition;
          }
          running = false;
        });
      }
    };
    window.addEventListener('scroll', handler);
    handler();
    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [sidebar, hideOnScroll, setHidden]);

  const k = [];
  if (sidebar) {
    k.push('sidebar');
  }
  if (!sidebar && !top && hidden) {
    k.push('hidden');
  }
  if (styletop && top) {
    k.push('top');
  }

  return (
    <nav className={k.join(' ')}>
      <div className="nav-container">
        <Container>
          <div className="element">{left}</div>
          {children && <div className="element">{children}</div>}
          <div className="element">{right}</div>
        </Container>
      </div>
    </nav>
  );
};

export {Navbar, Navitem, Navbar as default};
