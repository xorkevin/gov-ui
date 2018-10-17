import {h} from 'preact';

const Anchor = ({ext, noStyle, noColor, href, children}) => {
  let k = {};
  let j = [];
  if (ext) {
    k = {
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  if (noStyle) {
    j.push('no-style');
  } else if (noColor) {
    j.push('no-color');
  }

  return (
    <a className={j.join(' ')} {...k} href={href}>
      {children}
    </a>
  );
};

export default Anchor;
