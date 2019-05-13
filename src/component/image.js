import React, {
  Component,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

const deferLoadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(src);
    };
    img.onerror = reject;
    img.src = src;
  });
};

const ImgSizeSet = new Set(['sm', 'md', 'lg', 'full', 'fill']);

const Img = ({
  src,
  preview,
  imgWidth,
  imgHeight,
  size,
  light,
  noShadow,
  rounded,
  fixed,
  color,
  className,
  children,
}) => {
  const [imgsrc, setImgsrc] = useState(undefined);
  const [imgloaded, setImgloaded] = useState(false);
  const imgelem = useRef(null);
  const handleImgLoad = useCallback(() => {
    setImgloaded(true);
  }, [setImgloaded]);

  useEffect(() => {
    if (!src || !imgelem.current || imgloaded) {
      return;
    }
    let running = false;
    const handler = () => {
      if (!running) {
        running = true;
        window.requestAnimationFrame(async () => {
          const innerHeight = window.innerHeight;
          const {
            top: elemTop,
            bottom: elemBottom,
          } = imgelem.current.getBoundingClientRect();
          const halfHeight = innerHeight / 4;
          const topBound = -halfHeight;
          const bottomBound = innerHeight + halfHeight;
          if (
            (elemTop < bottomBound && elemTop > topBound) ||
            (elemBottom < bottomBound && elemBottom > topBound)
          ) {
            if (fixed) {
              try {
                await deferLoadImage(src);
                setImgsrc(src);
                setImgloaded(true);
              } catch (e) {}
            } else {
              setImgsrc(src);
            }
            return true;
          }
          running = false;
        });
      }
    };
    window.addEventListener('scroll', handler);
    window.addEventListener('resize', handler);
    handler();
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [src, fixed, setImgsrc, imgloaded, setImgloaded, imgelem.current]);

  const k = ['img'];

  let imgsize = size;
  if (fixed) {
    k.push('fixed');
    if (!imgsize) {
      imgsize = 'full';
    }
  }
  if (ImgSizeSet.has(imgsize)) {
    k.push('sized');
    k.push(size);
  }
  if (light) {
    k.push('light');
  }
  if (noShadow) {
    k.push('no-shadow');
  }
  if (rounded) {
    k.push('rounded');
  }
  if (className) {
    k.push(className);
  }

  if (!imgloaded) {
    k.push('invisible');
  }

  let image;
  let previewImage;
  if (fixed) {
    const s = {};
    const previewStyle = {};
    if (imgsrc) {
      s.backgroundImage = `url(${imgsrc})`;
    }
    if (preview) {
      previewStyle.backgroundImage = `url(${preview})`;
    }
    if (color) {
      s.backgroundColor = color;
      previewStyle.backgroundColor = color;
    }
    image = <div className="image" style={s} />;
    if (preview) {
      previewImage = <div className="image preview" style={previewStyle} />;
    }
  } else {
    image = <img className="image" src={imgsrc} onLoad={handleImgLoad} />;
    if (preview) {
      previewImage = <img className="image preview" src={preview} />;
    }
  }

  const j = {};
  if (!size && imgWidth && imgHeight && imgWidth !== 0) {
    j.paddingBottom = (imgHeight / imgWidth).toFixed(4) * 100 + '%';
  }

  return (
    <div className={k.join(' ')} ref={imgelem}>
      <div className="inner" style={j}>
        {children && <div className="children">{children}</div>}
        {image}
        {previewImage}
      </div>
    </div>
  );
};

export default Img;
