import {Fragment, useState, useEffect} from 'react';
import Img from '@xorkevin/nuke/src/component/image/rounded';

import {generateQR, QRECLevel} from '../utility';

const QRCode = ({data, level, scale}) => {
  const [datauri, setDataURI] = useState({err: null, uri: ''});

  useEffect(() => {
    const cancelRef = {current: false};
    (async () => {
      const [uri, err] = await generateQR(data, level, scale);
      if (cancelRef.current) {
        return;
      }
      if (err) {
        setDataURI({err, uri: ''});
        return;
      }
      setDataURI({err: null, uri});
    })();
    return () => {
      cancelRef.current = true;
    };
  }, [data, level, scale]);

  return (
    <Fragment>
      {datauri.uri && <Img src={datauri.uri} ratio={1} />}
      {datauri.err && <p>{datauri.err.message}</p>}
    </Fragment>
  );
};

export {QRCode, QRECLevel, QRCode as default};
