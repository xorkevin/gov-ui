import {h, Component} from 'preact';
import renderToString from 'preact-render-to-string';
import {isWeb} from 'utility';

const deferLoadImage = src => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      resolve(src);
    };
    img.src = src;
  });
};

class Img extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsrc: false,
      loaded: false,
    };

    this.imgLoaded = this.imgLoaded.bind(this);

    this.noscript = !isWeb()
      ? renderToString(<img className="image" src={props.src} />)
      : '';
  }

  tick() {
    if (!this.elem) {
      return false;
    }
    const innerHeight = window.innerHeight;
    const {
      top: elemTop,
      bottom: elemBottom,
    } = this.elem.getBoundingClientRect();
    const halfHeight = innerHeight / 4;
    const topBound = -halfHeight;
    const bottomBound = innerHeight + halfHeight;
    if (
      (elemTop < bottomBound && elemTop > topBound) ||
      (elemBottom < bottomBound && elemBottom > topBound)
    ) {
      if (this.props.fixed) {
        deferLoadImage(this.props.src).then(src => {
          this.setState(prevState => {
            return Object.assign({}, prevState, {imgsrc: src});
          });
          this.imgLoaded();
        });
      } else {
        this.setState(prevState => {
          return Object.assign({}, prevState, {imgsrc: this.props.src});
        });
      }
      return true;
    }
  }

  imgLoaded() {
    this.setState(prevState => {
      return Object.assign({}, prevState, {loaded: true});
    });
  }

  unbind() {
    if (this.handler) {
      window.removeEventListener('scroll', this.handler);
      window.removeEventListener('resize', this.handler);
      this.handler = false;
    }
  }

  componentDidMount() {
    if (this.props.src) {
      this.running = false;
      this.handler = () => {
        if (!this.running) {
          this.running = true;
          window.requestAnimationFrame(() => {
            if (this.tick()) {
              this.unbind();
            }
            this.running = false;
          });
        }
      };
      window.addEventListener('scroll', this.handler);
      window.addEventListener('resize', this.handler);
      this.handler();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => {
      return Object.assign({}, prevState, {imgsrc: nextProps.src});
    });
  }

  componentWillUnmount() {
    this.unbind();
  }

  render(
    {
      preview,
      size,
      fixed,
      color,
      rounded,
      imgWidth,
      imgHeight,
      className,
      children,
    },
    {imgsrc, loaded},
  ) {
    const k = ['img'];

    if (className) {
      k.push(className);
    }
    if (rounded) {
      k.push('rounded');
    }
    if (!loaded) {
      k.push('invisible');
    }
    if (fixed) {
      k.push('fixed');
      if (!size) {
        size = 'full';
      }
    }
    switch (size) {
      case 'sm':
      case 'md':
      case 'lg':
      case 'full':
      case 'fill':
        k.push('sized');
        k.push(size);
    }

    const s = {};
    let url = undefined;
    if (imgsrc) {
      url = imgsrc;
      s.backgroundImage = `url(${imgsrc})`;
    }

    const previewStyle = {};
    let previewUrl = undefined;
    if (preview) {
      previewUrl = preview;
      previewStyle.backgroundImage = `url(${preview})`;
    }

    if (color) {
      s.backgroundColor = color;
      previewStyle.backgroundColor = color;
    }

    let image;
    let previewImage;
    if (fixed) {
      image = <div className="image" style={s} />;
      if (preview) {
        previewImage = <div className="image preview" style={previewStyle} />;
      }
    } else {
      image = <img className="image" src={url} onLoad={this.imgLoaded} />;
      if (preview) {
        previewImage = <img className="image preview" src={previewUrl} />;
      }
    }

    const j = {};
    if (!size && imgWidth && imgHeight && imgWidth !== 0) {
      j.paddingBottom = (imgHeight / imgWidth).toFixed(4) * 100 + '%';
    }

    return (
      <div
        className={k.join(' ')}
        ref={elem => {
          this.elem = elem;
        }}>
        <div className="inner" style={j}>
          {children.length > 0 && <div className="children">{children}</div>}
          {image}
          {previewImage}
          <noscript dangerouslySetInnerHTML={{__html: this.noscript}} />
        </div>
      </div>
    );
  }
}

export default Img;
