import {h, Component} from 'preact';

const Tooltip = ({position, tooltip, children}) => {
  const k = ['tooltip'];
  switch (position) {
    case 'left':
    case 'right':
    case 'top':
    case 'bottom':
      k.push(position);
      break;
    default:
      k.push('top');
  }

  const j = ['tooltip-parent'];
  switch (display) {
    case 'inline':
    case 'block':
      j.push(display);
  }

  return (
    <span className={j.join(' ')}>
      <span className={k.join(' ')}>{tooltip}</span>
      {children && children.length > 0 && children[0]}
    </span>
  );
};

export default Tooltip;
