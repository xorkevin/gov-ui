import {h} from 'preact';

const FaIcon = ({border, icon}) => {
  if (border) {
    return (
      <span className="faicon border">
        <span className="inner">
          <i className={'fa fa-fw fa-' + icon} />
        </span>
      </span>
    );
  }
  return <i className={'fa fa-fw fa-' + icon} />;
};

export default FaIcon;
