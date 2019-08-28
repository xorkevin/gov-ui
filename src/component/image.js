import React, {useState, useEffect, useCallback, useRef} from 'react';

const useViewIntersectOnce = (refelem, callback) => {
  const [intersected, setIntersect] = useState(false);
  useEffect(() => {
    if (intersected) {
      return;
    }

    let cancelRef = {current: false};
    let running = null;
    const handler = () => {
      if (!running) {
        running = window.requestAnimationFrame(async () => {
          if (!refelem.current) {
            running = null;
            return;
          }
          const innerHeight = window.innerHeight;
          const {
            top: elemTop,
            bottom: elemBottom,
          } = refelem.current.getBoundingClientRect();

          const halfHeight = innerHeight / 4;
          const topBound = -halfHeight;
          const bottomBound = innerHeight + halfHeight;

          if (
            (elemTop < bottomBound && elemTop > topBound) ||
            (elemBottom < bottomBound && elemBottom > topBound)
          ) {
            setIntersect(true);
            callback(cancelRef);
          }
          running = null;
        });
      }
    };
    window.addEventListener('scroll', handler);
    window.addEventListener('resize', handler);
    handler();
    return () => {
      cancelRef.current = true;
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
      if (running) {
        window.cancelAnimationFrame(running);
      }
    };
  }, [intersected, setIntersect, refelem, callback]);
  return intersected;
};

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

  const imgCallback = useCallback(
    async (cancelRef) => {
      if (fixed) {
        try {
          await deferLoadImage(src);
          if (cancelRef && cancelRef.current) {
            return;
          }
          setImgsrc(src);
          setImgloaded(true);
        } catch (_e) {}
      } else {
        setImgsrc(src);
      }
    },
    [src, setImgsrc, setImgloaded, fixed],
  );
  useViewIntersectOnce(imgelem, imgCallback);

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
