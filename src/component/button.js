import {h} from 'preact';

const Button = ({
  primary,
  outline,
  text,
  raised,
  cta,
  fixedWidth,
  label,
  onClick,
  children,
}) => {
  const k = [];
  if (primary) {
    k.push('primary');
  } else if (outline) {
    k.push('outline');
  } else if (text) {
    k.push('text');
  }

  if (cta) {
    k.push('cta');
  }

  if (fixedWidth) {
    k.push('fixed-width');
  }

  if (raised) {
    k.push('raised');
  }

  return (
    <button className={k.join(' ')} onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
};

export default Button;
